// import { useState } from "react";
// import { View } from "react-native";
// import { Input } from "@/src/components/ui/Input";
// import { Button } from "@/src/components/ui/Button";
// import { FormLayout } from "@/src/components/ui/FormLayout";

// export function SignupForm() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   return (
//     <FormLayout title="Create Account">
//       <Input
//         label="Full Name"
//         value={fullName}
//         onChangeText={setFullName}
//       />
//       <Input
//         label="Email"
//         type="email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <Input
//         label="Password"
//         type="password"
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Input
//         label="Confirm Password"
//         type="password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <View className="mt-2">
//         <Button label="Sign Up" onPress={() => {/* add signup logic afterwardds*/}} />
//       </View>
//     </FormLayout>
//   );
// }

import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    // add signup logic afterwards
    router.replace("/portfolio");
  };

  return (
    <FormLayout title="Create Account">
      <Input
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChangeText={setPassword}
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View className="mt-2">
        <Button label="Sign Up" onPress={handleSignup} />
      </View>
    </FormLayout>
  );
}