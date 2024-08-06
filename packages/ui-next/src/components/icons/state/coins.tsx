import { forwardRef, memo } from "react";
import { iconVariants } from "../../utils";
import { StateIconProps } from "../types";

export const CoinsIcon = memo(
  forwardRef<SVGSVGElement, StateIconProps>(
    ({ className, size, variant, ...props }, forwardedRef) => (
      <svg
        viewBox="0 0 24 24"
        className={iconVariants({ size, className })}
        ref={forwardedRef}
        {...props}
      >
        {(() => {
          switch (variant) {
            case "solid":
              return (
                <path
                  className="fill-current"
                  d="M20 6.5c0 .563-.447 1.081-1.2 1.5-.91.503-2.266.86-3.822.966a4.472 4.472 0 0 0-.353-.157C13.394 8.294 11.756 8 10 8c-.26 0-.512.006-.766.019L9.2 8C8.447 7.581 8 7.062 8 6.5 8 5.119 10.688 4 14 4c3.313 0 6 1.119 6 2.5ZM9.022 9.034C9.34 9.012 9.669 9 10 9c1.944 0 3.669.384 4.766.981.775.422 1.234.947 1.234 1.519 0 .125-.022.247-.066.366-.143.412-.53.79-1.093 1.109-.003.003-.01.003-.013.006-.01.007-.019.01-.028.016-1.094.606-2.838 1-4.8 1-1.863 0-3.528-.353-4.631-.91-.06-.028-.116-.059-.172-.09C4.447 12.58 4 12.063 4 11.5c0-1.088 1.669-2.016 4-2.356.328-.047.669-.085 1.022-.11ZM17 11.5c0-.684-.331-1.247-.753-1.669a10.518 10.518 0 0 0 2.381-.64c.51-.213.985-.475 1.372-.797V9.5c0 .603-.516 1.16-1.369 1.59a7.57 7.57 0 0 1-1.637.579c.003-.056.006-.11.006-.166V11.5Zm-1 3c0 .563-.447 1.081-1.2 1.5-.056.031-.113.06-.172.09-1.1.557-2.765.91-4.628.91-1.963 0-3.706-.394-4.8-1-.753-.419-1.2-.938-1.2-1.5v-1.106c.39.322.862.584 1.372.797C6.606 14.706 8.244 15 10 15c1.756 0 3.394-.294 4.628-.81.244-.1.478-.215.7-.34.19-.106.369-.225.538-.35.046-.034.09-.072.134-.106V14.5Zm1 0v-1.81a9.672 9.672 0 0 0 1.628-.5c.51-.212.985-.474 1.372-.796V12.5c0 .328-.156.656-.466.966-.509.509-1.406.928-2.54 1.2.003-.053.006-.11.006-.166ZM10 18c1.756 0 3.394-.294 4.628-.81.51-.212.985-.474 1.372-.796V17.5c0 1.381-2.688 2.5-6 2.5-3.313 0-6-1.119-6-2.5v-1.106c.39.322.862.584 1.372.797C6.606 17.706 8.244 18 10 18Z"
                />
              );
            case "line":
              return (
                <path
                  className="fill-current"
                  d="M9.26 6.922c.04.037.09.075.143.112-.481.019-.95.06-1.403.121V6.52c0-.48.269-.873.606-1.166.34-.296.803-.538 1.335-.732C11.003 4.23 12.437 4 14 4c1.534 0 2.997.231 4.06.62.53.195.993.437 1.334.733.337.293.606.686.606 1.166v6.862c0 .485-.256.888-.597 1.196a4.66 4.66 0 0 1-1.337.769A8.55 8.55 0 0 1 17 15.67v-1.039a8 8 0 0 0 .712-.227c.463-.18.804-.378 1.022-.576.216-.195.266-.35.266-.447v-2.085c-.272.177-.587.33-.934.463a8.55 8.55 0 0 1-1.066.324v-1.039a8 8 0 0 0 .712-.226c.463-.18.804-.381 1.022-.577.216-.223.266-.35.266-.447V7.971a4.928 4.928 0 0 1-.94.447 9.577 9.577 0 0 1-1.876.46c-.056-.088-.115-.117-.175-.17a4.675 4.675 0 0 0-1.056-.709c1.085-.072 2.044-.264 2.738-.529.493-.17.834-.361 1.05-.548.218-.189.259-.327.259-.403 0-.076-.04-.214-.26-.402-.215-.187-.556-.379-1.05-.55-.9-.34-2.215-.56-3.69-.56s-2.79.22-3.719.56c-.465.171-.806.363-1.022.55-.218.188-.287.326-.287.402 0 .076.069.214.287.403ZM4 10.55c0-.482.267-.872.606-1.194.34-.267.805-.51 1.334-.705 1.063-.39 2.497-.62 4.06-.62 1.534 0 2.997.23 4.06.62.53.195.993.438 1.334.705.337.322.606.712.606 1.194v6.861c0 .485-.256.888-.597 1.197a4.66 4.66 0 0 1-1.337.768c-1.063.41-2.504.624-4.066.624-1.59 0-3.002-.214-4.067-.623-.531-.205-.995-.46-1.335-.769C4.258 18.3 4 17.896 4 17.411V10.55Zm1.258.403c.216.186.558.378 1.024.548.927.34 2.243.56 3.718.56s2.79-.22 3.69-.56c.494-.17.835-.362 1.05-.548.22-.189.26-.327.26-.403 0-.076-.04-.214-.26-.403-.215-.186-.556-.378-1.05-.548-.9-.369-2.215-.56-3.69-.56s-2.79.191-3.718.56c-.466.17-.808.362-1.024.548-.217.189-.258.327-.258.403 0 .075.04.214.258.403Zm8.801 1.496c-1.062.39-2.525.62-4.059.62-1.563 0-2.997-.23-4.06-.62a5.097 5.097 0 0 1-.94-.447v1.823c0 .098.05.223.267.447.216.195.558.397 1.022.576.927.353 2.236.583 3.711.583 1.475 0 2.784-.23 3.713-.583.462-.18.803-.38 1.021-.576.216-.224.266-.35.266-.447v-1.823c-.275.17-.594.32-.94.447Zm-8.792 5.41c.216.198.558.396 1.022.576.927.353 2.236.557 3.711.557 1.475 0 2.784-.204 3.713-.557.462-.18.803-.378 1.021-.576.216-.196.266-.35.266-.448v-2.084c-.272.176-.588.33-.934.463-1.063.41-2.504.649-4.066.649-1.59 0-3.002-.24-4.067-.65a6.493 6.493 0 0 1-.961-.462v2.085c0 .097.078.252.295.447Z"
                />
              );
          }
        })()}
      </svg>
    ),
  ),
);

CoinsIcon.displayName = "CoinsIcon";
