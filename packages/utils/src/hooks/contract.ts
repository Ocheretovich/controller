import { useMemo } from "react";
import { Provider, StarknetDomain, StarknetType } from "starknet";
import useSWR from "swr";

type PreSessionSummary = Omit<SessionSummary, "ERC20" | "ERC721">;

type SessionSummary = {
  default: Record<string, CallPolicy[]>;
  ERC20: Record<string, CallPolicy[]>;
  ERC721: Record<string, CallPolicy[]>;
  messages: TypedDataPolicy[];
};

type ContractType = keyof SessionSummary;

export function useSessionSummary({
  policies,
  provider,
}: {
  policies: Policy[];
  provider: Provider;
}) {
  const preSummary = useMemo(
    () =>
      policies.reduce<PreSessionSummary>(
        (prev, p) =>
          isCallPolicy(p)
            ? {
                ...prev,
                default: {
                  ...prev.default,
                  [p.target]: prev.default[p.target]
                    ? [...prev.default[p.target], p]
                    : [p],
                },
              }
            : { ...prev, messages: [...prev.messages, p] },
        { default: {}, messages: [] },
      ),
    [policies],
  );

  const res: SessionSummary = {
    default: {},
    ERC20: {},
    ERC721: {},
    messages: preSummary.messages,
  };

  const summary = useSWR(
    `tx-summary`,
    async () => {
      const promises = Object.entries(preSummary.default).map(
        async ([addr, calls]) => {
          const contractType = await checkContractType(provider, addr);
          switch (contractType) {
            case "ERC20":
              res.ERC20[addr] = calls;
              return;
            case "ERC721":
              res.ERC721[addr] = calls;
              return;
            case "default":
            default:
              res.default[addr] = calls;
              return;
          }
        },
      );
      await Promise.allSettled(promises);

      return res;
    },
    { fallbackData: res },
  );

  return summary;
}

// TODO: What the id?
const IERC20_ID = "";
const IERC721_ID =
  "0x33eb2f84c309543403fd69f0d0f363781ef06ef6faeb0131ff16ea3175bd943";

async function checkContractType(
  provider: Provider,
  contractAddress: string,
): Promise<ContractType> {
  try {
    // SNIP-5: check with via `support_interface` method
    const [erc20Res] = await provider.callContract({
      contractAddress,
      entrypoint: "supports_interface",
      calldata: [IERC20_ID], // ERC20 interface ID
    });
    if (!!erc20Res) {
      return "ERC20";
    }

    const [erc721Res] = await provider.callContract({
      contractAddress,
      entrypoint: "supports_interface",
      calldata: [IERC721_ID], // ERC721 interface ID
    });
    if (!!erc721Res) {
      return "ERC721";
    }

    return "default";
  } catch {
    try {
      await provider.callContract({
        contractAddress,
        entrypoint: "balanceOf",
        calldata: ["0x0"], // ERC721 interface ID
      });

      try {
        await provider.callContract({
          contractAddress,
          entrypoint: "decimals",
        });

        return "ERC20";
      } catch {
        await provider.callContract({
          contractAddress,
          entrypoint: "tokenId",
          calldata: ["0x0"],
        });

        return "ERC721";
      }
    } catch {
      return "default";
    }
  }
}

function isCallPolicy(policy: Policy): policy is CallPolicy {
  return !!(policy as CallPolicy).target;
}

// Dup of @cartridge/controller/types
type Policy = CallPolicy | TypedDataPolicy;

type CallPolicy = {
  target: string;
  method: string;
  description?: string;
};

type TypedDataPolicy = {
  types: Record<string, StarknetType[]>;
  primaryType: string;
  domain: StarknetDomain;
};
