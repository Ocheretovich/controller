import { forwardRef, memo } from "react";
import { iconVariants } from "../../utils";
import { IconProps } from "../types";

export const NonFungibleFootballIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    ({ className, size, ...props }, forwardedRef) => (
      <svg
        viewBox="0 0 24 24"
        className={iconVariants({ size, className })}
        ref={forwardedRef}
        {...props}
      >
        <path
          d="M6.64491 8.49624C6.02187 9.44678 5.68361 10.5093 5.61375 11.5786L7.43133 13.4778L7.01183 16.0117C7.34725 16.4282 7.7411 16.8087 8.19062 17.1417C8.64195 17.4761 9.12227 17.7424 9.62005 17.9422L11.993 16.7978L14.2772 17.9814C15.2763 17.6017 16.1911 16.969 16.9159 16.0978L16.5608 13.4845L18.3914 11.6788C18.3363 10.5917 18.0052 9.52313 17.4149 8.58642L14.8214 8.11724L13.6712 5.82114C12.6003 5.53179 11.4801 5.52967 10.423 5.79742L9.17903 8.11262L6.64491 8.49624ZM7.23783 18.4276C3.68804 15.7976 2.94236 10.7876 5.57236 7.23783C8.20237 3.68804 13.2124 2.94236 16.7622 5.57236C20.312 8.20237 21.0576 13.2124 18.4276 16.7622C15.7976 20.312 10.7876 21.0576 7.23783 18.4276Z"
          className="fill-current"
        />
        <path
          d="M13.8996 11.2043L12.7306 11.188L11.3852 9.4084L11.3724 11.2124L10.1662 11.2739C10.1662 11.2739 10.2022 10.3441 10.2649 9.5152C10.3415 8.79894 10.4228 8.19644 10.4228 8.19644L11.4188 8.09661L12.6227 9.43742L12.5019 8.08616L13.484 8.16394C13.484 8.16394 13.6025 8.76179 13.7185 9.46993C13.823 10.2895 13.8996 11.2043 13.8996 11.2043Z"
          className="fill-current"
        />
        <path
          d="M11.8345 12.198L11.8623 13.3635L10.1071 13.331L10.1651 13.8998L11.3771 13.9509L11.4316 14.8297L10.2835 14.7647L10.4843 15.8663L9.35249 15.8582C9.35249 15.8582 9.26659 15.0166 9.09361 14.1993C8.95663 13.2567 8.88117 12.2282 8.88117 12.2282C8.88117 12.2282 9.49876 12.2258 10.2034 12.22C10.987 12.2119 11.8345 12.198 11.8345 12.198Z"
          className="fill-current"
        />
        <path
          d="M15.2753 12.0854L15.2416 13.0802L13.8637 13.2439L13.8277 13.8139L14.8492 13.6676L14.7343 14.5023L13.7429 14.6811L13.5955 15.8118L12.4427 15.9139C12.4427 15.9139 12.4648 15.2209 12.4834 14.37C12.4938 13.3484 12.4903 12.1817 12.4903 12.1817C12.4903 12.1817 13.3064 12.1573 14.0471 12.133C14.7041 12.1074 15.2753 12.0854 15.2753 12.0854Z"
          className="fill-current"
        />
      </svg>
    ),
  ),
);

NonFungibleFootballIcon.displayName = "NonFungibleFootballIcon";
