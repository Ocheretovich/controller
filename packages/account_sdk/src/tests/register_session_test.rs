use crate::{
    abigen::erc_20::Erc20,
    account::session::{
        hash::{AllowedMethod, Session},
        SessionAccount,
    },
    signers::{HashSigner, SignerTrait},
    tests::{account::FEE_TOKEN_ADDRESS, runners::katana::KatanaRunner},
    transaction_waiter::TransactionWaiter,
};
use cainome::cairo_serde::{ContractAddress, U256};
use starknet::{
    accounts::Account,
    core::types::{BlockId, BlockTag},
    macros::{felt, selector},
    providers::Provider,
    signers::SigningKey,
};

#[tokio::test]
async fn test_verify_execute_session_registered() {
    let signer = SigningKey::from_random();
    let guardian_signer = SigningKey::from_random();
    let session_signer = SigningKey::from_random();

    let runner = KatanaRunner::load();
    let controller = runner
        .deploy_controller("username".to_owned(), &signer)
        .await;

    let session = Session::new(
        vec![
            AllowedMethod::new(*FEE_TOKEN_ADDRESS, selector!("tdfs")),
            AllowedMethod::new(*FEE_TOKEN_ADDRESS, selector!("transfds")),
            AllowedMethod::new(*FEE_TOKEN_ADDRESS, selector!("transfer")),
        ],
        u64::MAX,
        &session_signer.signer(),
    )
    .unwrap();

    let tx = controller
        .contract
        .register_session(&session.raw(), &signer.signer().guid())
        .send()
        .await
        .unwrap();

    TransactionWaiter::new(tx.transaction_hash, runner.client())
        .wait()
        .await
        .unwrap();

    let session_account = SessionAccount::new_as_registered(
        runner.client(),
        session_signer,
        guardian_signer,
        controller.address(),
        runner.client().chain_id().await.unwrap(),
        signer.signer().guid(),
        session,
    );

    let recipient = ContractAddress(felt!("0x18301129"));
    let contract_erc20 = Erc20::new(*FEE_TOKEN_ADDRESS, &session_account);

    contract_erc20
        .balanceOf(&recipient)
        .block_id(BlockId::Tag(BlockTag::Latest))
        .call()
        .await
        .expect("failed to call contract");

    contract_erc20
        .transfer(
            &recipient,
            &U256 {
                low: 0x10_u128,
                high: 0,
            },
        )
        .send()
        .await
        .unwrap();
}
