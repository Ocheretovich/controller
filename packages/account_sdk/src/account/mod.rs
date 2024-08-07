use async_trait::async_trait;
use cainome::cairo_serde::CairoSerde;
use cainome::cairo_serde::ContractAddress;
use starknet::{accounts::Call, macros::selector};
use starknet::{
    accounts::{Account, ConnectedAccount, ExecutionEncoder},
    core::types::{BlockId, BlockTag, Felt},
    providers::Provider,
};

pub mod macros;
pub mod outside_execution;
pub mod session;

use crate::{abigen, typed_data::TypedData};
use crate::{
    abigen::controller::SignerSignature,
    impl_account, impl_execution_encoder,
    signers::{HashSigner, SignError},
};

#[derive(Clone, Debug)]
pub struct OwnerAccount<P, S, G>
where
    P: Provider + Send,
    S: HashSigner + Send,
    G: HashSigner + Send,
{
    pub provider: P,
    pub(crate) signer: S,
    pub address: Felt,
    pub chain_id: Felt,
    pub(crate) block_id: BlockId,
    pub(crate) guardian: G,
}

impl<P, S, G> OwnerAccount<P, S, G>
where
    P: Provider + Send,
    S: HashSigner + Send,
    G: HashSigner + Send,
{
    pub fn new(provider: P, signer: S, guardian: G, address: Felt, chain_id: Felt) -> Self {
        OwnerAccount {
            provider,
            signer,
            address,
            chain_id,
            block_id: BlockId::Tag(BlockTag::Latest),
            guardian,
        }
    }

    pub fn set_signer(&mut self, new_signer: S) {
        self.signer = new_signer;
    }
}

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
impl<P, S, G> AccountHashSigner for OwnerAccount<P, S, G>
where
    P: Provider + Send + Sync,
    S: HashSigner + Send + Sync,
    G: HashSigner + Send + Sync,
{
    async fn sign_hash(&self, hash: Felt) -> Result<Vec<Felt>, SignError> {
        let owner_signature = self.signer.sign(&hash).await?;
        let guardian_signature = self.guardian.sign(&hash).await?;
        Ok(Vec::<SignerSignature>::cairo_serialize(&vec![
            owner_signature,
            guardian_signature,
        ]))
    }
}

impl_account!(OwnerAccount<P: Provider, S: HashSigner, G: HashSigner>);
impl_execution_encoder!(OwnerAccount<P: Provider, S: HashSigner, G: HashSigner>);

impl<P, S, G> ConnectedAccount for OwnerAccount<P, S, G>
where
    P: Provider + Send + Sync + Clone,
    S: HashSigner + Send + Sync + Clone,
    G: HashSigner + Send + Sync + Clone,
{
    type Provider = P;

    fn provider(&self) -> &Self::Provider {
        &self.provider
    }

    fn block_id(&self) -> BlockId {
        self.block_id
    }
}

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
pub trait AccountHashSigner {
    async fn sign_hash(&self, hash: Felt) -> Result<Vec<Felt>, SignError>;
}

pub enum CallEncoder {}

impl CallEncoder {
    fn encode_calls(calls: &[Call]) -> Vec<Felt> {
        <Vec<abigen::controller::Call> as CairoSerde>::cairo_serialize(
            &calls
                .iter()
                .map(
                    |Call {
                         to,
                         selector,
                         calldata,
                     }| abigen::controller::Call {
                        to: ContractAddress(*to),
                        selector: *selector,
                        calldata: calldata.clone(),
                    },
                )
                .collect(),
        )
    }
}

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
pub trait AccountHashAndCallsSigner {
    async fn sign_hash_and_calls(&self, hash: Felt, calls: &[Call])
        -> Result<Vec<Felt>, SignError>;
}

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
impl<P, S, G> AccountHashAndCallsSigner for OwnerAccount<P, S, G>
where
    P: Provider + Send + Sync,
    S: HashSigner + Send + Sync,
    G: HashSigner + Send + Sync,
{
    async fn sign_hash_and_calls(
        &self,
        hash: Felt,
        _calls: &[Call],
    ) -> Result<Vec<Felt>, SignError> {
        self.sign_hash(hash).await
    }
}

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
pub trait MessageSignerAccount {
    async fn sign_message(&self, data: TypedData) -> Result<Vec<Felt>, SignError>;
}

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
impl<T> MessageSignerAccount for T
where
    T: AccountHashSigner + Account + Sync,
{
    async fn sign_message(&self, data: TypedData) -> Result<Vec<Felt>, SignError> {
        let hash = data.encode(self.address())?;
        self.sign_hash(hash).await
    }
}

pub const DECLARATION_SELECTOR: Felt = selector!("__declare_transaction__");
