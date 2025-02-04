import { Field } from "@cartridge/ui";
import { Button, useMediaQuery } from "@chakra-ui/react";
import { Container, Footer, Content, useLayout } from "components/layout";
import { useCallback, useEffect, useRef, useState } from "react";
import Controller from "utils/controller";
import { LoginMode, LoginProps } from "./types";
import { fetchAccount, validateUsernameFor } from "./utils";
import { RegistrationLink } from "./RegistrationLink";
import { useControllerTheme } from "hooks/theme";
import { doLogin } from "hooks/account";
import { useConnection } from "hooks/connection";
import { ErrorAlert } from "components/ErrorAlert";
import { usePostHog } from "posthog-js/react";

export function Login(props: LoginProps) {
  const theme = useControllerTheme();
  const [isHeightOver600] = useMediaQuery("(min-height: 600px)");

  return (
    <Container
      variant={isHeightOver600 ? "expanded" : "compressed"}
      title={
        theme.id === "cartridge" ? "Play with Controller" : `Play ${theme.name}`
      }
      description="Enter your username"
    >
      <Form {...props} />
    </Container>
  );
}

function Form({
  prefilledName = "",
  isSlot,
  mode = LoginMode.Webauthn,
  onSignup,
}: LoginProps) {
  const posthog = usePostHog();
  const hasLoggedFocus = useRef(false);
  const hasLoggedChange = useRef(false);
  const { footer } = useLayout();
  const { origin, policies, chainId, rpcUrl, setController } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [usernameField, setUsernameField] = useState({
    value: prefilledName,
    error: undefined,
  });
  const [isValidating, setIsValidating] = useState(false);

  const onSubmit = useCallback(async () => {
    setIsValidating(true);
    const error = await validateUsernameFor("login")(usernameField.value);
    if (error) {
      setUsernameField((u) => ({ ...u, error }));
      setIsValidating(false);
      return;
    }

    setIsValidating(false);
    setIsLoading(true);

    const {
      account: {
        credentials: {
          webauthn: [{ id: credentialId, publicKey }],
        },
        controllers,
      },
    } = await fetchAccount(usernameField.value);

    const controllerNode = controllers.edges?.[0].node;

    try {
      const controller = new Controller({
        appId: origin,
        classHash: controllerNode.constructorCalldata[0],
        chainId,
        rpcUrl,
        address: controllerNode?.address,
        username: usernameField.value,
        publicKey,
        credentialId,
      });

      if (mode === LoginMode.Webauthn || policies?.length === 0) {
        await doLogin({
          name: usernameField.value,
          credentialId,
          finalize: isSlot,
        });
      }

      window.controller = controller;
      setController(controller);
    } catch (e) {
      setError(e);
    }

    setIsLoading(false);
  }, [
    usernameField.value,
    chainId,
    rpcUrl,
    origin,
    policies,
    mode,
    setController,
    isSlot,
  ]);

  useEffect(() => {
    if (!isValidating || !footer.isOpen) return;
    footer.onToggle();
  }, [isValidating, footer]);
  return (
    <form
      style={{ width: "100%" }}
      onKeyDown={(e) => {
        e.key === "Enter" && e.preventDefault();
      }}
    >
      <Content>
        <Field
          {...usernameField}
          autoFocus
          onFocus={() => {
            if (!hasLoggedFocus.current) {
              posthog?.capture("Focus Login Username");
              hasLoggedFocus.current = true;
            }
          }}
          onChange={(e) => {
            if (!hasLoggedChange.current) {
              posthog?.capture("Change Login Username");
              hasLoggedChange.current = true;
            }

            setError(undefined);
            setUsernameField((u) => ({
              ...u,
              value: e.target.value.toLowerCase(),
              error: undefined,
            }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Username"
          error={usernameField.error}
          isLoading={isValidating}
          isDisabled={isLoading}
          onClear={() => {
            setError(undefined);
            setUsernameField((u) => ({ ...u, value: "" }));
          }}
        />
      </Content>

      <Footer showCatridgeLogo>
        {error && (
          <ErrorAlert
            title="Login failed"
            description={
              error.message.includes(
                "The operation either timed out or was not allowed",
              )
                ? "Passkey signing timed out or was canceled. Please try again."
                : error.message
            }
            isExpanded
            allowToggle
          />
        )}
        <Button
          onClick={onSubmit}
          colorScheme="colorful"
          isLoading={isLoading}
          isDisabled={
            isValidating || !usernameField.value || !!usernameField.error
          }
        >
          Log in
        </Button>
        <RegistrationLink
          description="Need a controller?"
          onClick={() => onSignup(usernameField.value)}
        >
          Sign Up
        </RegistrationLink>
      </Footer>
    </form>
  );
}
