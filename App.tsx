import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // Thư viện điều hướng chính
import { createStackNavigator } from "@react-navigation/stack"; // Stack navigation (chuyển màn hình dạng stack)
import ShiftScreen from "./src/ShiftScreen"; // Layout 1
import WeeklyShiftScreen from "./src/WeeklyShiftScreen"; // Layout 2

// Khởi tạo Stack Navigator
const Stack = createStackNavigator();

// Màn hình chính (Home)
const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Nút mở Layout 01 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ShiftScreen")}
      >
        <Text style={styles.buttonText}>Layout 01</Text>
      </TouchableOpacity>

      {/* Nút mở Layout 02 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]} // Thêm marginTop để cách nút trên
        onPress={() => navigation.navigate("WeeklyShiftScreen")}
      >
        <Text style={styles.buttonText}>Layout 02</Text>
      </TouchableOpacity>
    </View>
  );
};

// Component gốc của app
export default function App() {
  return (
    // NavigationContainer phải bao ngoài cùng
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        {/* Màn hình Home */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Trang chính" }} // Hiển thị tiêu đề trên header
        />

        {/* Layout 01 */}
        <Stack.Screen
          name="ShiftScreen"
          component={ShiftScreen}
          options={{ headerShown: false }} // Ẩn header trên màn hình này
        />

        {/* Layout 02 */}
        <Stack.Screen
          name="WeeklyShiftScreen"
          component={WeeklyShiftScreen}
          options={{ headerShown: false }} // Ẩn header trên màn hình này
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Style chung
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  button: {
    backgroundColor: "#0cc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { 
    fontSize: 16, 
    color: "#fff", 
    fontWeight: "bold" 
  },
});