import { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Wallet, UserCircle2, ArrowRight } from "lucide-react-native";

import { TransactionHeader } from "@/src/components/ui/TransactionHeader";
import { AmountInput } from "@/src/components/ui/AmountInput";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SelectableRow } from "@/src/components/ui/SelectableRow";
import { ListItem } from "@/src/components/ui/ListItem";
import { Button } from "@/src/components/ui/Button";
import { PROVIDERS, ProviderId } from "@/src/constants/mobileMoneyProviders";

const recentWallets = [
  {
    key: "my-wallet",
    label: "My Wallet",
    phone: "024 123 4567",
    icon: <Wallet size={18} color="#166534" />,
    iconBackgroundColor: "#DCFCE7",
    providerId: "mtn" as ProviderId,
  },
  {
    key: "elder-mensah",
    label: "Elder Mensah",
    phone: "020 987 6543",
    icon: <UserCircle2 size={18} color="#92400E" />,
    iconBackgroundColor: "#FDE9C8",
    providerId: "vodafone" as ProviderId,
  },
];

export function WithdrawAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [providerId, setProviderId] = useState<ProviderId>("mtn");
  const [phone, setPhone] = useState(recentWallets[0].phone);

  const canContinue = Number(amount) > 0;

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <TransactionHeader title="Withdraw Funds" />

      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 20 }}>
        <View>
          <Text className="text-base font-bold mb-2" style={{ color: "#111827" }}>
            Withdraw Amount
          </Text>
          <AmountInput label="Amount in GHS" value={amount} onChangeValue={setAmount} />
        </View>

        <View>
          <SectionHeader title="Select Destination Wallet" />
          {Object.values(PROVIDERS).map((provider) => (
            <SelectableRow
              key={provider.id}
              logo={provider.logo}
              title={provider.name}
              subtitle="Instant Withdrawal"
              selected={providerId === provider.id}
              onPress={() => setProviderId(provider.id as ProviderId)}
            />
          ))}
        </View>

        <View>
          <SectionHeader title="Recent Wallets" actionLabel="View All" onActionPress={() => {}} />
          {recentWallets.map((wallet) => (
            <ListItem
              key={wallet.key}
              label={wallet.label}
              subtitle={wallet.phone}
              icon={wallet.icon}
              iconBackgroundColor={wallet.iconBackgroundColor}
              rightIcon={
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: providerId === wallet.providerId ? "#166534" : "transparent",
                  }}
                >
                  <Image
                    source={PROVIDERS[wallet.providerId].logo}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              }
              onPress={() => {
                setProviderId(wallet.providerId);
                setPhone(wallet.phone);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <View className="pb-4">
        <Button
          label="Proceed to Withdraw"
          variant="primary"
          disabled={!canContinue}
          icon={<ArrowRight size={18} color="#fff" style={{ marginLeft: 8 }} />}
          iconPosition="right"
          onPress={() =>
            router.push({
              pathname: "/withdraw/confirm",
              params: { amount, providerId, phone },
            })
          }
        />
      </View>
    </View>
  );
}