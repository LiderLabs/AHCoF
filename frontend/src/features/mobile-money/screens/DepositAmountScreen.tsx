import { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { UserCircle2 } from "lucide-react-native";

import { TransactionHeader } from "@/src/components/ui/TransactionHeader";
import { AmountInput } from "@/src/components/ui/AmountInput";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SelectableTile } from "@/src/components/ui/SelectableTile";
import { ListItem } from "@/src/components/ui/ListItem";
import { Button } from "@/src/components/ui/Button";
import { PROVIDERS, ProviderId } from "@/src/constants/mobileMoneyProviders";

const recentNumbers = [
  { key: "samuel", name: "Samuel Mensah", phone: "024 456 7890", provider: "MTN" },
  { key: "ama", name: "Ama Serwaa", phone: "020 123 4567", provider: "Vodafone" },
];

export function DepositAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [providerId, setProviderId] = useState<ProviderId>("mtn");

  const canContinue = Number(amount) > 0 && !!providerId;

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <TransactionHeader title="Deposit Funds" />

      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 20 }}>
        <Text className="text-base" style={{ color: "#6B7280" }}>
          Enter amount and select your Mobile Money provider.
        </Text>

        <AmountInput label="Deposit Amount" value={amount} onChangeValue={setAmount} />

        <View>
          <SectionHeader title="Select Provider" />
          <View className="flex-row" style={{ gap: 12 }}>
            {Object.values(PROVIDERS).map((provider) => (
              <SelectableTile
                key={provider.id}
                logo={provider.logo}
                label={provider.name}
                selected={providerId === provider.id}
                onPress={() => setProviderId(provider.id as ProviderId)}
              />
            ))}
          </View>
        </View>

        <View>
          <SectionHeader title="Recent Numbers" actionLabel="See All" onActionPress={() => {}} />
          {recentNumbers.map((contact) => (
            <ListItem
              key={contact.key}
              label={contact.name}
              subtitle={`${contact.phone} • ${contact.provider}`}
              icon={<UserCircle2 size={20} color="#166534" />}
              iconBackgroundColor="#DCFCE7"
              onPress={() => {}}
            />
          ))}
        </View>
      </ScrollView>

      <View className="pb-6">
        <Button
          label="Continue"
          variant="primary"
          disabled={!canContinue}
          onPress={() =>
            router.push({
              pathname: "/deposit/confirm",
              params: { amount, providerId },
            })
          }
        />
      </View>
    </View>
  );
}