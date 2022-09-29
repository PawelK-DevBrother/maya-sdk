import {TransferStatusType} from './../src/@types/transfers.types';
import {NetworkObject} from './../src/@types/payments.types';
import {CreateCryptoDepositAddressArgs} from './../dist/@types/crypto-deposit-address.types.d';
import {CreatePaymentRouteArgs, UpdatePaymentRouteArgs} from './../dist/@types/payments.types.d';
import {ActionTrigger, CryptoNetworkSpeed, Maya_Sdk, PspServiceStatus, ToggleSwitch, TransferDirection} from '../src/index';
import {expectToEqual, sleep} from './helpers';

jest.setTimeout(20000);

describe('main', () => {
    let sdk: Maya_Sdk, transfer_id: string, payment_route_id: string, crypto_deposit_address_id: string;

    const currency_id = 'BTC';
    const crypto_network_label = 'test_label';
    const crypto_network = 'test_network';
    // btc address
    const destination_address = '13MDY1ggro6Epsut3Req4WaXLBzVdU7azQ';

    const psp_service_id = 'PSP_TESTS';

    const user_id = 'test_user_id';
    const limit_group_id = 'KYC1';

    beforeAll(() => {
        sdk = new Maya_Sdk('http://localhost:3000/graphql');
        sdk.setXUserId(user_id);
        sdk.setXUserLimitGroupId(limit_group_id);
    });

    describe('HEALTHCHECK', () => {
        test('healthcheck', async () => {
            const result = await sdk.healthcheck();
            expect(result).toEqual({message: 'ok', status: true});
        });
    });

    describe('SETTINGS', () => {
        test('system_settings', async () => {
            const result = await sdk.system_settings();
            // console.log(result);
            expect(true).toEqual(true);
        });
    });

    describe('CURRENCIES PROPERTIES', () => {
        const networks: NetworkObject[] = [{label: crypto_network_label, value: crypto_network, notes: 'lorem ipsum'}];

        test('currencies_properties', async () => {
            const result = await sdk.currencies_properties();
            // console.log(result);
            expect(true).toEqual(true);
        });

        test('add_currency_networks', async () => {
            const result = await sdk.add_currency_networks({currency_id, networks});
            expect(result).toEqual(networks);
        });

        test('currencies_properties with args', async () => {
            const result = await sdk.currencies_properties({properties: ['network_list']});
            const record = result[0];
            expectToEqual(record, {data: {currency_id, name: 'network_list'}, omit: ['value']});

            const record_network: NetworkObject = JSON.parse(record.value)[0];
            expect(record_network.label).toEqual(networks[0].label);
            expect(record_network.value).toEqual(networks[0].value);
            expect(record_network.notes).toEqual(networks[0].notes);
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

            const result = await sdk.create_payment_route(createPaymentRouteArgs);
            payment_route_id = result.payment_route_id;
            expectToEqual(result, {data: createPaymentRouteArgs, omit: ['payment_route_id', 'crypto_address_tag_type']});
        });

        test('update_payment_route', async () => {
            updatePaymentRouteArgs = {
                payment_route_id,
                is_active: ToggleSwitch.on,
            };

            const result = await sdk.update_payment_route(updatePaymentRouteArgs);
            expect(result).toBeTruthy();
        });

        test('payment_routes', async () => {
            const result = await sdk.payments_routes();

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

            const result = await sdk.create_crypto_deposit_address(createCryptoDepositAddressArgs);
            crypto_deposit_address_id = result.crypto_deposit_address_id;

            expectToEqual(result, {
                data: {...createCryptoDepositAddressArgs, user_id},
                omit: ['crypto_deposit_address_id', 'address', 'address_tag_type', 'address_tag_value', 'psp_message', 'created_at', 'updated_at'],
            });
        });

        test('update_crypto_deposit_address', async () => {
            const result = await sdk.update_crypto_deposit_address({crypto_deposit_address_id, address: destination_address});
            expect(result).toBeTruthy();
        });

        test('crypto_deposit_addresses', async () => {
            const result = await sdk.crypto_deposit_addresses();
            // console.log(result);
            expect(true).toEqual(true);
        });
    });
    describe('TRANSFERS', () => {
        test('external_transfer_form_details', async () => {
            const result = await sdk.external_transfer_form_details({
                currency_id,
                network: crypto_network,
            });
            // console.log(result);
            expect(true).toEqual(true);
        });

        test('estimate_validate_external_transfer', async () => {
            const result = await sdk.estimate_validate_external_transfer({
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
            const result = await sdk.create_external_transfer({
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
            // console.log(result);
            expect(true).toEqual(true);
        });

        test('transfer', async () => {
            const result = await sdk.transfer({transfer_id});
            // console.log(result);
            expect(result.psp_service_status).toEqual(null);
            expect(result.psp_service_trigger).toEqual(null);
        });

        test('admin_approve_outgoing_transfer', async () => {
            const result = await sdk.admin_approve_outgoing_transfer({transfer_id});
            expect(result).toBeTruthy();
        });

        test('transfer', async () => {
            const result = await sdk.transfer({transfer_id});
            // console.log(result);
            expect(result.psp_service_status).toEqual(PspServiceStatus.pending);
            expect(result.psp_service_trigger).toEqual(ActionTrigger.manual);
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

    describe('LIMITS', () => {
        test('operations_limits', async () => {
            const result = await sdk.operations_limits({limit_group_id});
            // console.log(result);
            expect(result.limit_group_id).toEqual(limit_group_id);
        });
    });

    describe('CLEAN UP', () => {
        test('delete_crypto_deposit_address', async () => {
            const result = await sdk.delete_crypto_deposit_address({crypto_deposit_address_id});
            expect(result).toBeTruthy();
        });

        test('delete_payment_route', async () => {
            const result = await sdk.delete_payment_route({payment_route_id});
            expect(result).toBeTruthy();
        });

        test('remove_currency_networks', async () => {
            const result = await sdk.remove_currency_networks({currency_id, labels: [crypto_network_label]});
            expect(result).toEqual([]);
        });
    });
});