import { Icon, useStyleConfig } from "@chakra-ui/react";

const Rookie = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 10 9" fill="currentColor" __css={styles} {...rest}>
      <path d="M5.64976 3.598L9.20347 1.92332C9.43083 1.83382 9.60906 1.65874 9.69484 1.44048C9.78062 1.22222 9.76563 0.980405 9.65487 0.772338C9.54327 0.56427 9.34506 0.409609 9.1077 0.345229C8.87034 0.280847 8.61549 0.31225 8.40395 0.432376L5.25 1.9147L2.09605 0.432376C1.88451 0.312253 1.62966 0.280849 1.3923 0.345229C1.15494 0.409607 0.956733 0.56427 0.845133 0.772338C0.734366 0.980385 0.719376 1.22222 0.805157 1.44048C0.890951 1.65874 1.06917 1.83382 1.29653 1.92332L4.85024 3.598C5.10176 3.71733 5.39824 3.71733 5.64976 3.598Z" />
      <path d="M5.64976 8.09702L9.20347 6.42235C9.43083 6.33284 9.60906 6.15776 9.69484 5.9395C9.78062 5.72124 9.76563 5.47943 9.65487 5.27136C9.54327 5.06329 9.34506 4.90863 9.1077 4.84425C8.87034 4.77987 8.61549 4.81127 8.40395 4.9314L5.25 6.41372L2.09605 4.9314C1.88451 4.81128 1.62966 4.77987 1.3923 4.84425C1.15494 4.90863 0.956733 5.06329 0.845133 5.27136C0.734366 5.47941 0.719376 5.72124 0.805157 5.9395C0.890951 6.15776 1.06917 6.33284 1.29653 6.42235L4.85024 8.09702C5.10176 8.21636 5.39824 8.21636 5.64976 8.09702Z" />
    </Icon>
  );
};

export default Rookie;
