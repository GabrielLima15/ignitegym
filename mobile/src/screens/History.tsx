import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";
import { HistoryByDayDTO } from "@dtos/HistoryGroupByDayDTO";
import { Heading, useToast, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useCallback, useState } from "react";
import { SectionList } from "react-native";


export function History() {
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  async function fetchHistory() {
    try {
      setIsLoading(true)

      const response = await api.get('/history')
      setExercises(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error?.message : 'Não foi possível carregar o histórico.'

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

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && {
            flex: 1,
            justifyContent: "center",
          }
        }
        ListEmptyComponent={() => (
          <Heading
            color="$gray100"
            textAlign="center"
          >
            Não há exercícios registrados ainda. {'\n'} Vamos fazer exercícios hoje?
          </Heading>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}