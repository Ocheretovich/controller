use cainome::rs::Abigen;
use starknet::core::types::Felt;
use std::{collections::HashMap, process::Command};

fn main() {
    println!("cargo:rerun-if-changed=./compiled");
    generate_controller_bindings();
    generate_erc20_bindings();
    generate_class_hashes();
    Command::new("cargo")
        .args(["fmt", "--all"])
        .status()
        .expect("Failed to format the code");
}

fn generate_class_hashes() {
    let controller_class_hash = extract_class_hash("controller");
    let controller_compiled_class_hash = extract_compiled_class_hash("controller");
    let erc20_compiled_class_hash = extract_compiled_class_hash("erc20");
    let code = format!(
        r#"use starknet::macros::felt;
use starknet_crypto::Felt;

pub const ACCOUNT_CLASS_HASH: Felt =
    felt!("{controller_class_hash:#x}");

pub const ACCOUNT_COMPILED_CLASS_HASH: Felt =
    felt!("{controller_compiled_class_hash:#x}");

pub const ERC_20_COMPILED_CLASS_HASH: Felt =
    felt!("{erc20_compiled_class_hash:#x}");
"#
    );
    std::fs::write("./src/constants.rs", code).unwrap();
}

fn extract_compiled_class_hash(contract_name: &str) -> Felt {
    use starknet::core::types::contract::CompiledClass;
    use std::fs::File;
    use std::io::BufReader;
    let compiled_class: CompiledClass = serde_json::from_reader(BufReader::new(
        File::open(format!(
            "./compiled/{contract_name}.compiled_contract_class.json"
        ))
        .unwrap(),
    ))
    .unwrap();
    compiled_class.class_hash().unwrap()
}

fn extract_class_hash(contract_name: &str) -> Felt {
    use starknet::core::types::contract::SierraClass;
    use std::fs::File;
    use std::io::BufReader;
    let compiled_class: SierraClass = serde_json::from_reader(BufReader::new(
        File::open(format!("./compiled/{contract_name}.contract_class.json")).unwrap(),
    ))
    .unwrap();
    compiled_class.class_hash().unwrap()
}

fn generate_controller_bindings() {
    let abigen = Abigen::new("Controller", "./compiled/controller.contract_class.json")
        .with_types_aliases(HashMap::from([
            (
                String::from("argent::outside_execution::outside_execution::outside_execution_component::Event"),
                String::from("OutsideExecutionEvent"),
            ),
            (
                String::from("controller::account::CartridgeAccount::Event"),
                String::from("ControllerEvent"),
            ),
            (
                String::from("controller::external_owners::external_owners::external_owners_component::Event"),
                String::from("ExternalOwnersEvent"),
            ),
            (
                String::from("controller::delegate_account::delegate_account::delegate_account_component::Event"),
                String::from("DelegateAccountEvent"),
            ),
            (
                String::from("controller::session::session::session_component::Event"),
                String::from("SessionEvent"),
            ),
            (
                String::from("controller::multiple_owners::multiple_owners::multiple_owners_component::Event"),
                String::from("MultipleOwnersEvent"),
            ),
            (
                String::from("controller::introspection::src5::src5_component::Event"),
                String::from("Src5ComponentEvent"),
            ),
            (
                String::from("openzeppelin::token::erc20::erc20::ERC20Component::Event"),
                String::from("ERC20ComponentEvent"),
            ),
            (
                String::from("openzeppelin::access::ownable::ownable::OwnableComponent::Event"),
                String::from("OwnableComponentEvent"),
            ),
            (
                String::from("openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"),
                String::from("UpgradeEvent"),
            ),
            (
                String::from("openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event"),
                String::from("ReentrancyGuardEvent"),
            ),
        ]))
        .with_derives(vec![
            String::from("Clone"),
            String::from("serde::Serialize"),
            String::from("serde::Deserialize"),
            String::from("PartialEq"),
            String::from("Debug"),
        ]);

    abigen
        .generate()
        .expect("Fail to generate bindings for Controller")
        .write_to_file("./src/abigen/controller.rs")
        .unwrap();
}

fn generate_erc20_bindings() {
    let abigen = Abigen::new("Erc20", "./compiled/erc20.contract_class.json")
        .with_types_aliases(HashMap::from([
            (
                String::from("openzeppelin::token::erc20::erc20::ERC20Component::Event"),
                String::from("ERC20ComponentEvent"),
            ),
            (
                String::from("openzeppelin::access::ownable::ownable::OwnableComponent::Event"),
                String::from("OwnableComponentEvent"),
            ),
            (
                String::from("openzeppelin::upgrades::upgradeable::UpgradeableComponent::Event"),
                String::from("UpgradeEvent"),
            ),
            (
                String::from(
                    "openzeppelin::security::reentrancyguard::ReentrancyGuardComponent::Event",
                ),
                String::from("ReentrancyGuardEvent"),
            ),
        ]))
        .with_derives(vec![
            String::from("Clone"),
            String::from("serde::Serialize"),
            String::from("serde::Deserialize"),
            String::from("PartialEq"),
            String::from("Debug"),
        ]);

    abigen
        .generate()
        .expect("Fail to generate bindings for ERC20")
        .write_to_file("./src/abigen/erc_20.rs")
        .unwrap();
}
