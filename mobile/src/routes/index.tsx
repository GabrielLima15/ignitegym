import { DefaultTheme, NavigationContainer } from "@react-navigation/native"

import { gluestackUIConfig } from "../../config/gluestack-ui.config"
import { Box } from "@gluestack-ui/themed"
import { AuthRoutes } from "./auth.routes"
import { useAuth } from "@hooks/useAuth"
import { AppRoutes } from "./app.routes"
import { Loading } from "@components/Loading"

export function Routes() {

  const { user, isLoadingUserStorageData } = useAuth()

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}