import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { SectionList } from "react-native";


export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "22.07.24",
      data: ["puxada frontal", "remada curvada"]
    },
    {
      title: "22.07.24",
      data: ["puxada frontal"]
    }
  ])

  return (
    <VStack>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={() => <HistoryCard />}
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