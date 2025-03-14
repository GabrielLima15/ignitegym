import { Box, Heading, Text, useToast } from "@gluestack-ui/themed";
import { HStack, Icon, VStack } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import BodySvg from '@assets/body.svg';
import Series from '@assets/series.svg';
import Reps from '@assets/repetitions.svg';
// import { Image } from "@gluestack-ui/themed";
import { Image } from 'expo-image';


import { Button } from "@components/Button";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const navigation = useNavigation<HomeNavigatorRoutesProps>()
  const route = useRoute()

  const { exerciseId } = route.params as RouteParamsProps

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error?.message : 'Não foi possível carregar os exercícios. Tente novamente mais tarde.'

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        )
      })

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack justifyContent="space-between" alignItems="center" mt="$4" mb="$8">
          <Heading color="$gray100" fontFamily="$heading" fontSize="$lg" flexShrink={1}>{exercise.name}</Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">Costas</Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? <Loading /> :
        <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 62 }}>
          <VStack p="$8">
            <Image source={{
              uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
            }}
              style={{
                width: "100%",
                height: 350,
                resizeMode: 'cover',
                borderRadius: 8,
                marginBottom: 10
              }}
            />

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                <HStack>
                  <Series />
                  <Text color="$gray200" ml="$2">{exercise.series} Séries</Text>
                </HStack>

                <HStack>
                  <Reps />
                  <Text color="$gray200" ml="$2">{exercise.repetitions} Repetições</Text>
                </HStack>
              </HStack>

              <Button title="Marcar como realizado" />
            </Box>

          </VStack>

        </ScrollView>
      }

    </VStack>
  )
}