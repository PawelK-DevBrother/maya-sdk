import {
    Maya_Sdk,
    ActionTrigger,
    ToggleSwitch,
    PspServiceStatus,
    TransferDirection,
    CryptoNetworkSpeed,
    CreateCryptoDepositAddressArgs,
    CryptoDepositAddress,
} from '../src/index';
import {expectToEqual, sleep} from './helpers';
import {CreatePaymentRouteArgs, NetworkObject, UpdatePaymentRouteArgs, Vasp} from './../src/@types/payments.types';
import 'dotenv/config';
import {AccountTransactionType} from '../src/@types/accounts-transactions.types';
import {gql} from 'graphql-request';

jest.setTimeout(20000);

describe('main', () => {
    let paymaya_sdk: Maya_Sdk,
        transfers_sdk: Maya_Sdk,
        transfer_id: string,
        payment_route_id: string,
        crypto_deposit_address_id: string,
        parent_transaction_id: string,
        vasp: Vasp;

    const currency_id_db = 'ETH';
    const currency_id = 'eTh';

    const network = 'test_network';
    const crypto_network_label = 'test_label';
    const address_tag_type = null;

    const revertAccountTransactionSecretKey = process.env.REVERT_ACCOUNT_TRANSACTION_SECRET_KEY || '';

    const destination_address = '0xeB46B672091152595e2135EC6b251e1c8BF35750';

    const psp_service_id = 'PSP_TESTS';

    const user_id = 'pawel_test_id';
    const default_limit_group_id = 'KYC1';

    const defaultRecipientInternalFee = 0.025;
    const defaultSenderInternalFee = 0.025;

    const networks: NetworkObject[] = [
        {label: crypto_network_label, value: network, notes: 'Test notes', heading: 'Test heading', secondary: 'Test secondary'},
    ];

    beforeAll(() => {
        paymaya_sdk = new Maya_Sdk('http://localhost:3000/graphql');
        transfers_sdk = new Maya_Sdk('http://localhost:3001/graphql');

        paymaya_sdk.setGlobalAuthToken(process.env.AUTH_TOKEN || '');
        transfers_sdk.setGlobalApiKey(process.env.API_KEY || '');

        transfers_sdk.setGlobalXUserId(user_id);
    });

    describe('HEALTHCHECK', () => {
        test('healthcheck', async () => {
            const result = await transfers_sdk.healthcheck();
            expect(result).toEqual({message: 'ok', status: true});
        });
    });

    // describe('ACCOUNTS TRANSACTIONS', () => {
    //     test('create_account_transactions', async () => {
    //         const items = [
    //             {
    //                 user_id,
    //                 amount: 0.000777,
    //                 currency_id: currency_id_db,
    //                 type: AccountTransactionType.credit,
    //             },
    //         ];
    //         const result = await paymaya_sdk.create_account_transactions({items}, {'x-service-api-key': process.env.SERVICE_API_KEY || ''});
    //         expect(typeof result).toEqual('string');

    //         parent_transaction_id = result;
    //     });
    //     test('revert_account_transactions', async () => {
    //         await sleep(1500);

    //         const result = await paymaya_sdk.revert_account_transaction({parent_transaction_id, secretKey: revertAccountTransactionSecretKey});
    //         expect(typeof result).toEqual('string');
    //     });
    // });

    describe('SETTINGS', () => {
        test('system_settings', async () => {
            const result = await transfers_sdk.system_settings();
            console.log('settings ', result);
            expect(true).toEqual(true);
        });
    });

    describe('NOTABENE', () => {
        test('destinations_wallets', async () => {
            const result = await transfers_sdk.destinations_wallets();
            expect(result).toBeInstanceOf(Array);

            vasp = result[0];
        });
    });

    describe('LIMITS', () => {
        test('create_default_user_limit_group', async () => {
            const result = await transfers_sdk.create_defualt_user_limit_group();

            expect(result.user_id).toEqual(user_id);
            expect(result.limit_group_id).toEqual(default_limit_group_id);
        });
        test('user_limit_group', async () => {
            const result = await transfers_sdk.user_limit_group();

            expect(result.user_id).toEqual(user_id);
            expect(result.limit_group_id).toEqual(default_limit_group_id);
        });

        // test('operations_limits', async () => {
        //     const result = await paymaya_sdk.operations_limits();
        //     expect(result.limit_group_id).toEqual(default_limit_group_id);
        //     expect(result.sell_option).toEqual(de)
        // });
    });

    describe('CURRENCIES PROPERTIES', () => {
        test('currencies_properties', async () => {
            const result = await transfers_sdk.currencies_properties();
            console.log('currencies properties ', result);

            expect(true).toEqual(true);
        });

        test('add_currency_networks', async () => {
            const result = await paymaya_sdk.add_currency_networks({currency_id: currency_id_db, networks});

            expect(result).toEqual(networks);
        });

        test('currencies_properties - filter networks lists', async () => {
            const result = (await transfers_sdk.currencies_properties({currency_id, properties: ['network_list']}))[0];

            expectToEqual(result, {data: {currency_id: currency_id_db, name: 'network_list'}, omit: ['value']});

            const {label, value, notes, heading, secondary} = JSON.parse(result.value)[0];
            const network = networks[0];

            expect(label).toEqual(network.label);
            expect(value).toEqual(network.value);
            expect(notes).toEqual(network.notes);
            expect(heading).toEqual(network.heading);
            expect(secondary).toEqual(network.secondary);
        });
    });

    describe('PAYMENTS ROUTES', () => {
        let updatePaymentRouteArgs: UpdatePaymentRouteArgs;

        const createPaymentRouteArgs: CreatePaymentRouteArgs = {
            currency_id: currency_id_db,
            crypto_network: network,
            psp_service_id,
            is_active: ToggleSwitch.off,
        };

        const createPaymentRouteResult = {...createPaymentRouteArgs, crypto_address_tag_type: address_tag_type};

        test('create_payment_route', async () => {
            const result = await paymaya_sdk.create_payment_route(createPaymentRouteArgs);

            expectToEqual(result, {data: createPaymentRouteResult, omit: ['payment_route_id']});
            payment_route_id = result.payment_route_id;
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
            const result = await paymaya_sdk.payments_routes({
                currency_id: createPaymentRouteResult.currency_id,
                crypto_network: createPaymentRouteResult.crypto_network,
            });

            expectToEqual(result[0], {data: {...createPaymentRouteResult, ...updatePaymentRouteArgs, payment_route_id}, omit: []});
        });
    });

    describe('CRYPTO DEPOSIT ADDRESSES', () => {
        let createCryptoDepositAddressArgs: CreateCryptoDepositAddressArgs;
        let cryptoDepositAddress: CryptoDepositAddress;

        test('create_crypto_deposit_address', async () => {
            createCryptoDepositAddressArgs = {
                currency_id,
                network,
            };

            const result = await paymaya_sdk.create_crypto_deposit_address(createCryptoDepositAddressArgs);

            expectToEqual(result, {
                data: {...createCryptoDepositAddressArgs, user_id, currency_id: currency_id_db},
                omit: ['crypto_deposit_address_id', 'address', 'address_tag_type', 'address_tag_value', 'psp_message', 'created_at', 'updated_at'],
            });

            crypto_deposit_address_id = result.crypto_deposit_address_id;
            cryptoDepositAddress = result;
        });

        test('update_crypto_deposit_address', async () => {
            const result = await paymaya_sdk.update_crypto_deposit_address({crypto_deposit_address_id, address: destination_address});
            expect(result).toBeTruthy();
        });

        test('crypto_deposit_addresses', async () => {
            const result = (await paymaya_sdk.crypto_deposit_addresses(createCryptoDepositAddressArgs))[0];
            expectToEqual(result, {data: {...cryptoDepositAddress, address: destination_address}, omit: []});
        });
    });

    describe('TRANSFERS', () => {
        test('external_transfer_form_details', async () => {
            const args = {
                currency_id,
                network,
            };

            const result = await paymaya_sdk.external_transfer_form_details(args);

            expectToEqual(result, {
                data: {psp_service_id, address_tag_type, internal_fee_value: defaultSenderInternalFee, ...args, currency_id: currency_id_db},
                omit: ['network_fees', 'networks'],
            });
            expectToEqual(result.networks[0], {data: networks[0], omit: []});
        });

        test('estimate_validate_external_transfer', async () => {
            const result = await paymaya_sdk.estimate_validate_external_transfer({
                currency_id,
                network,
                amount: 0.001,
                destination_address: destination_address,
                direction: TransferDirection.cryptoToFiat,
                network_speed: CryptoNetworkSpeed.medium,
            });
            console.log(result);
            expect(true).toEqual(true);
        });

        test('create_external_transfer', async () => {
            const result = await paymaya_sdk.create_external_transfer({
                currency_id,
                network,
                amount: 1,
                destination_address,
                direction: TransferDirection.cryptoToFiat,
                network_speed: CryptoNetworkSpeed.medium,
                destination_wallet: 'test',
                counterparty_first_name: '123',
                counterparty_last_name: '123456',
            });
            transfer_id = result.transfer_id;

            expect(result.user_id).toEqual(user_id);
        });

        // test('transfer', async () => {
        //     const result = await paymaya_sdk.transfer({transfer_id});
        //     // console.log(result);
        //     expect(result.psp_service_status).toEqual(PspServiceStatus.PENDING);
        //     expect(result.psp_service_trigger).toEqual(ActionTrigger.auto);
        // });

        // // test('admin_approve_outgoing_transfer', async () => {
        // //     const result = await sdk.admin_approve_outgoing_transfer({transfer_id});
        // //     expect(result).toBeTruthy();
        // // });

        // test('transfer', async () => {
        //     await sleep(3000);
        //     const result = await paymaya_sdk.transfer({transfer_id});
        //     // console.log(result);
        //     expect(result.psp_service_status).toEqual(PspServiceStatus.COMPLETED);
        // });

        // test('admin_transfers', async () => {
        //     const result = await transfers_sdk.admin_transfers();
        //     expect(true).toBeTruthy();
        // });

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
            await sleep(10_000);
            const result = await paymaya_sdk.delete_crypto_deposit_address({crypto_deposit_address_id});
            expect(result).toBeTruthy();
        });

        test('delete_payment_route', async () => {
            await sleep(5_000);
            const result = await paymaya_sdk.delete_payment_route({payment_route_id});
            expect(result).toBeTruthy();
        });

        test('remove_currency_networks', async () => {
            await sleep(5_000);
            const result = await paymaya_sdk.remove_currency_networks({currency_id, values: [network]});
            expect(result).toEqual([]);
        });

        test('delete_user_limit_group', async () => {
            await sleep(5_000);
            const result = await transfers_sdk.delete_user_limit_group();
            expect(result).toBeTruthy();
        });
    });

    describe('test only', () => {
        test('one man army', async () => {
            expect(true).toBeTruthy();
        });
    });
});
