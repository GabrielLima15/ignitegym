import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .oneOf([yup.ref('password'), null], 'A Confirmação de senha não confere')
    .when('password', ([password], schema) =>
      password ? schema.required('Informe a confirmação da senha.') : schema
    ),
})

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https://github.com/gabriellima15.png");
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast();
  const { user, updateUserProfile } = useAuth()


  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = await FileSystem.getInfoAsync(photoURI) as {
          size: number
        }

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Essa imagem é muito grande. Escolha uma de até 5MB"
                action="error"
                onClose={() => toast.close(id)}
              />
            )
          })
        }

        setUserPhoto(photoURI)
      }
    } catch (error) {
      console.log(error)
    }


  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil atualizado com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        )
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error?.message : 'Não Foi possível atualizar seus dados. Tente novamente mais tarde'

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
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{
        paddingBottom: 36
      }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
            alt="Foto do usuário"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="$green500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">Alterar foto</Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input errorMessage={errors?.name?.message} value={value} onChangeText={onChange} placeholder="Nome" bg="$gray600" />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input value={value} onChangeText={onChange} placeholder="E-mail" bg="$gray600" isReadOnly />
              )}
            />
          </Center>

          <Heading alignSelf="flex-start" fontFamily="$heading" color="$gray200" fontSize="$md" mt="$12" mb="$2">Alterar senha</Heading>

          <Center w="$full" gap="$4">
            <Controller
              name="old_password"
              control={control}
              render={({ field: { onChange } }) => (
                <Input onChangeText={onChange} placeholder="Senha antiga" bg="$gray600" secureTextEntry />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange } }) => (
                <Input errorMessage={errors?.password?.message} onChangeText={onChange} placeholder="Nova senha" bg="$gray600" secureTextEntry />
              )}
            />
            <Controller
              name="confirm_password"
              control={control}
              render={({ field: { onChange } }) => (
                <Input errorMessage={errors?.confirm_password?.message} onChangeText={onChange} placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry />
              )}
            />

            <Button isLoading={isUpdating} onPress={handleSubmit(handleProfileUpdate)} title="Atualizar" />
          </Center>

        </Center>
      </ScrollView>
    </VStack>
  )
}