import {
    Maya_Sdk,
    ActionTrigger,
    ToggleSwitch,
    PspServiceStatus,
    TransferDirection,
    CryptoNetworkSpeed,
    CreateCryptoDepositAddressArgs,
} from '../src/index';
import {expectToEqual, expectToEqualObject, sleep} from './helpers';
import {CreatePaymentRouteArgs, NetworkObject, UpdatePaymentRouteArgs} from './../src/@types/payments.types';
import 'dotenv/config';
import {AccountTransactionType} from '../src/@types/accounts-transactions.types';

jest.setTimeout(20000);

describe('main', () => {
    let paymaya_sdk: Maya_Sdk,
        transfers_sdk: Maya_Sdk,
        transfer_id: string,
        payment_route_id: string,
        crypto_deposit_address_id: string,
        parent_transaction_id: string;

    const currency_id = 'BTC';
    const crypto_network_label = 'test_label';
    const crypto_network = 'test_network';
    const secretKey = '123';
    // btc address
    const destination_address = 'mwX1ybWhq4sVaSqRx8abADnjC9YZcb7Gjn';

    const psp_service_id = 'PSP_TESTS';

    const user_id = 'broker-user-id';
    const limit_group_id = 'KYC1';

    beforeAll(() => {
        paymaya_sdk = new Maya_Sdk('http://localhost:3000/graphql');
        transfers_sdk = new Maya_Sdk('http://localhost:3001/graphql');
        // sdk.setGlobalXUserId(user_id);
        paymaya_sdk.setGlobalAuthToken(process.env.AUTH_TOKEN || '');
        paymaya_sdk.setGlobalApiKey(process.env.API_KEY || '');
        transfers_sdk.setGlobalXUserId(user_id);
        transfers_sdk.setGlobalApiKey(process.env.API_KEY || '');
    });

    describe('HEALTHCHECK', () => {
        test('healthcheck', async () => {
            const result = await transfers_sdk.healthcheck();
            console.log(result);
            expect(result).toEqual({message: 'ok', status: true});
        });
    });

    describe('ACCOUNTS TRANSACTIONS', () => {
        test('create_account_transactions', async () => {
            const items = [
                {
                    user_id,
                    amount: 1.777,
                    currency_id: 'BTC',
                    type: AccountTransactionType.credit,
                },
            ];
            const result = await paymaya_sdk.create_account_transactions({items});
            expect(true).toBeTruthy();
            parent_transaction_id = result;
        });
        test('revert_account_transactions', async () => {
            await sleep(3000);
            const result = await paymaya_sdk.revert_account_transaction({parent_transaction_id, secretKey});
            expect(result).toBeTruthy();
        });
    });

    describe('NOTABENE', () => {
        test.only('destinations_wallets', async () => {
            const result = await transfers_sdk.destinations_wallets();
            console.log(result);
            expect(result).toEqual([]);
        });
    });

    describe('SETTINGS', () => {
        test('system_settings', async () => {
            const result = await transfers_sdk.system_settings();
            console.log(result);
            expect(true).toEqual(true);
        });
    });

    describe('LIMITS', () => {
        test('create_default_user_limit_group', async () => {
            const result = await transfers_sdk.create_defualt_user_limit_group();
            expect(result.user_id).toEqual(user_id);
            expect(result.limit_group_id).toEqual('KYC1');
        });
        test('user_limit_group', async () => {
            const result = await transfers_sdk.user_limit_group();
            expect(result.user_id).toEqual(user_id);
            expect(result.limit_group_id).toEqual('KYC1');
        });
        test('operations_limits', async () => {
            const result = await paymaya_sdk.operations_limits();
            console.log(result);
            expect(result.limit_group_id).toEqual(limit_group_id);
        });
    });

    describe('CURRENCIES PROPERTIES', () => {
        const networks: NetworkObject[] = [{label: crypto_network_label, value: crypto_network, notes: 'lorem ipsum'}];

        test('currencies_properties', async () => {
            const result = await paymaya_sdk.currencies_properties();
            console.log(result);
            expect(true).toEqual(true);
        });

        test('add_currency_networks', async () => {
            const result = await paymaya_sdk.add_currency_networks({currency_id, networks});
            console.log(result);
            expect(result).toEqual(networks);
        });

        test('currencies_properties - filter networks lists', async () => {
            const result = await transfers_sdk.currencies_properties({properties: ['network_list']});
            const record = result[0];
            expectToEqual(record, {data: {currency_id, name: 'network_list'}, omit: ['value']});

            const record_network: NetworkObject = JSON.parse(record.value)[0];
            expect(record_network.label).toEqual(networks[0].label);
            expect(record_network.value).toEqual(networks[0].value);
            expect(record_network.notes).toEqual(networks[0].notes);
            expect(true).toBeTruthy();
        });
    });

    describe('PAYMENTS ROUTES', () => {
        let updatePaymentRouteArgs: UpdatePaymentRouteArgs;
        let createPaymentRouteArgs: CreatePaymentRouteArgs;

        test('create_payment_route', async () => {
            createPaymentRouteArgs = {
                currency_id,
                crypto_network,
                psp_service_id,
                is_active: ToggleSwitch.off,
            };

            const result = await paymaya_sdk.create_payment_route(createPaymentRouteArgs);
            payment_route_id = result.payment_route_id;
            expectToEqual(result, {data: createPaymentRouteArgs, omit: ['payment_route_id', 'crypto_address_tag_type']});
        });

        test('update_payment_route', async () => {
            updatePaymentRouteArgs = {
                payment_route_id,
                is_active: ToggleSwitch.on,
            };

            const result = await paymaya_sdk.update_payment_route(updatePaymentRouteArgs);
            expect(result).toBeTruthy();
        });

        test('payment_routes', async () => {
            const result = await paymaya_sdk.payments_routes();

            expectToEqual(result[0], {data: {...createPaymentRouteArgs, ...updatePaymentRouteArgs, crypto_address_tag_type: null}, omit: []});
        });
    });

    describe('CRYPTO DEPOSIT ADDRESSES', () => {
        let createCryptoDepositAddressArgs: CreateCryptoDepositAddressArgs;

        test('create_crypto_deposit_address', async () => {
            createCryptoDepositAddressArgs = {
                currency_id,
                network: crypto_network,
            };

            const result = await paymaya_sdk.create_crypto_deposit_address(createCryptoDepositAddressArgs);
            crypto_deposit_address_id = result.crypto_deposit_address_id;

            expectToEqual(result, {
                data: {...createCryptoDepositAddressArgs, user_id},
                omit: ['crypto_deposit_address_id', 'address', 'address_tag_type', 'address_tag_value', 'psp_message', 'created_at', 'updated_at'],
            });
        });

        test('update_crypto_deposit_address', async () => {
            const result = await paymaya_sdk.update_crypto_deposit_address({crypto_deposit_address_id, address: destination_address});
            expect(result).toBeTruthy();
        });

        test('crypto_deposit_addresses', async () => {
            const result = await paymaya_sdk.crypto_deposit_addresses();
            // console.log(result);
            expect(true).toEqual(true);
        });
    });

    describe('TRANSFERS', () => {
        test('external_transfer_form_details', async () => {
            const result = await paymaya_sdk.external_transfer_form_details({
                currency_id,
                network: crypto_network,
            });
            // console.log(result);
            expect(true).toEqual(true);
        });

        test('estimate_validate_external_transfer', async () => {
            const result = await paymaya_sdk.estimate_validate_external_transfer({
                currency_id,
                network: crypto_network,
                amount: 0.001,
                destination_address,
                direction: TransferDirection.cryptoToFiat,
                network_speed: CryptoNetworkSpeed.medium,
            });
            // console.log(result);
            expect(true).toEqual(true);
        });

        test('create_external_transfer', async () => {
            const result = await paymaya_sdk.create_external_transfer({
                currency_id,
                network: crypto_network,
                amount: 1,
                destination_address,
                direction: TransferDirection.cryptoToFiat,
                network_speed: CryptoNetworkSpeed.medium,
                destination_wallet: 'test',
                counterparty_first_name: '123',
                counterparty_last_name: '123456',
            });
            transfer_id = result.transfer_id;

            expect(true).toEqual(true);
            expect(result.psp_service_status).toEqual(null);
            expect(result.psp_service_trigger).toEqual(null);
        });

        test('transfer', async () => {
            const result = await paymaya_sdk.transfer({transfer_id});
            // console.log(result);
            expect(result.psp_service_status).toEqual(PspServiceStatus.pending);
            expect(result.psp_service_trigger).toEqual(ActionTrigger.auto);
        });

        // test('admin_approve_outgoing_transfer', async () => {
        //     const result = await sdk.admin_approve_outgoing_transfer({transfer_id});
        //     expect(result).toBeTruthy();
        // });

        test('transfer', async () => {
            await sleep(3000);
            const result = await paymaya_sdk.transfer({transfer_id});
            // console.log(result);
            expect(result.psp_service_status).toEqual(PspServiceStatus.completed);
        });

        // test('admin_approve_incoming_transfer', async () => {
        //     const result = await sdk.admin_approve_outgoing_transfer({transfer_id});
        //     expect(result).toBeTruthy();
        // });

        // test('provide_more_info_transfer', async () => {
        //     const result = await sdk.provide_transfer_more_info({
        //         transfer_id,
        //         destination_wallet: '123',
        //         counterparty_first_name: '123',
        //         counterparty_last_name: '123456',
        //     });
        //     expect(result).toBeTruthy();
        // });
    });

    describe('CLEAN UP', () => {
        test('delete_crypto_deposit_address', async () => {
            const result = await paymaya_sdk.delete_crypto_deposit_address({crypto_deposit_address_id});
            expect(result).toBeTruthy();
        });

        test('delete_payment_route', async () => {
            const result = await paymaya_sdk.delete_payment_route({payment_route_id});
            expect(result).toBeTruthy();
        });

        test('remove_currency_networks', async () => {
            const result = await paymaya_sdk.remove_currency_networks({currency_id, labels: [crypto_network_label]});
            expect(result).toEqual([]);
        });

        test('delete_user_limit_group', async () => {
            const result = await transfers_sdk.delete_user_limit_group();
            expect(result).toBeTruthy();
        });
    });
});
