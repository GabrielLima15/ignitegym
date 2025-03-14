import {
  Toast,
  Pressable, VStack,
  Icon,
  ToastTitle, ToastDescription
} from "@gluestack-ui/themed";
import { X } from "lucide-react-native";


type Prps = {
  id: string | number;
  title: string;
  description?: string;
  action?: "error" | "success" | "warning" | "info";
  onClose: () => void;
}

export function ToastMessage({ id, title, description, action = "success", onClose }: Prps) {
  return (
    <Toast nativeID={`toast-${id}`} action={action} bgColor={action === "success" ? "$green500" : "$red500"} mt="$10">
      <VStack space="xs" w="$full">
        <Pressable alignSelf="flex-end" onPress={onClose}>
          <Icon as={X} color="$coolGray50" size="md" />
        </Pressable>

        <ToastTitle color="$white" fontFamily="$heading">
          {title}
        </ToastTitle>

        {description && (
          <ToastDescription color="$white" fontFamily="$body">
            {description}
          </ToastDescription>
        )}
      </VStack>
    </Toast>
  );
}