import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { width } = Dimensions.get("window"); // Lấy chiều rộng màn hình để tính drawer
const Stack = createStackNavigator();

// ==========================
// Dữ liệu nhân viên mẫu
// ==========================
const employees = [
    { id: "0", name: "Tất cả nhân viên", role: "", type: "" }, // option mặc định
    {
        id: "1",
        name: "Hương Thảo",
        role: "Bán hàng",
        type: "Parttime",
        avatar: require("../assets/avatar1.jpg"),
    },
    {
        id: "2",
        name: "Mai Anh",
        role: "Bán hàng",
        type: "Parttime",
        avatar: require("../assets/avatar2.jpg"),
    },
    {
        id: "3",
        name: "Tuấn Minh",
        role: "Thu ngân",
        type: "Parttime",
        avatar: require("../assets/avatar3.jpg"),
    },
    {
        id: "4",
        name: "Mai Anh",
        role: "Bán hàng",
        type: "Parttime",
        avatar: require("../assets/avatar4.jpg"),
    },
    {
        id: "5",
        name: "Lê Bình An",
        role: "Pha chế",
        type: "Parttime",
        avatar: require("../assets/avatar5.jpg"),
    },
    {
        id: "6",
        name: "Mai Anh",
        role: "Bán hàng",
        type: "Parttime",
        avatar: require("../assets/avatar6.jpg"),
    },
];

// ==========================
// Dữ liệu ca làm việc mẫu
// ==========================
const shifts = [
    { id: "morning", title: "Ca sáng", icon: "☀️", employees: ["1", "2"] },
    { id: "afternoon", title: "Ca trưa", icon: "🌞", employees: ["3", "5"] },
    { id: "evening", title: "Ca tối", icon: "🌙", employees: ["4", "6"] },
];

// ==========================
// Màn hình chính hiển thị ca làm việc
// ==========================
const ShiftScreen = ({ navigation }: any) => {
    // Trạng thái drawer (mở/đóng)
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    // Animation cho drawer (bắt đầu ngoài màn hình)
    const drawerAnim = useState(new Animated.Value(width * 0.75))[0];

    // Ngày được chọn trên lịch (mặc định: hôm nay)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    // Nhân viên được chọn trong Picker (mặc định: tất cả)
    const [selectedEmployee, setSelectedEmployee] = useState("0");

    // Toggle mở/đóng drawer
    const toggleDrawer = () => {
        if (isDrawerOpen) {
            // đóng drawer
            Animated.timing(drawerAnim, {
                toValue: width * 0.75,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setDrawerOpen(false));
        } else {
            // mở drawer
            setDrawerOpen(true);
            Animated.timing(drawerAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    // Hàm render 1 shift block
    const renderShift = (shift: any) => {
        // Nếu chọn "tất cả nhân viên" thì hiển thị hết,
        // ngược lại lọc ra đúng nhân viên
        const filteredEmployees =
            selectedEmployee === "0"
                ? shift.employees
                : shift.employees.filter((id: string) => id === selectedEmployee);

        // Nếu ca này không có nhân viên => bỏ qua
        if (filteredEmployees.length === 0) return null;

        return (
            <View style={styles.shiftCard} key={shift.id}>
                {/* Cột icon ca */}
                <View style={styles.shiftIconCol}>
                    <Text style={styles.shiftIcon}>{shift.icon}</Text>
                </View>

                {/* Cột thông tin ca */}
                <View style={styles.shiftContentCol}>
                    <Text style={styles.shiftTitle}>{shift.title}</Text>

                    {/* Danh sách nhân viên của ca */}
                    {filteredEmployees.map((id: string) => {
                        const emp = employees.find((e) => e.id === id);
                        if (!emp) return null;
                        return (
                            <View key={emp.id} style={styles.empRow}>
                                {emp.avatar && <Image source={emp.avatar} style={styles.avatar} />}
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.empName}>{emp.name}</Text>
                                    <Text style={styles.empRole}>
                                        {emp.role} • {emp.type}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Nút back (chỉ hiện nếu có màn hình trước đó) */}
                {navigation.canGoBack() ? (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtn}>←</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} /> // giữ khoảng trống để title nằm giữa
                )}

                <Text style={styles.title}>Ca làm việc</Text>

                {/* Nút mở drawer */}
                <TouchableOpacity onPress={toggleDrawer}>
                    <Text style={styles.menuBtn}>☰</Text>
                </TouchableOpacity>
            </View>

            {/* Nội dung cuộn */}
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Bộ lọc nhân viên */}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedEmployee}
                        onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#0cc"
                    >
                        {employees.map((emp) => (
                            <Picker.Item key={emp.id} label={emp.name} value={emp.id} />
                        ))}
                    </Picker>
                </View>

                {/* Lịch */}
                <Calendar
                    current={selectedDate}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={{
                        [selectedDate]: {
                            selected: true,
                            selectedColor: "#0cc",
                            selectedTextColor: "#fff",
                        },
                    }}
                    theme={{ todayTextColor: "#0cc", arrowColor: "#0cc" }}
                    style={styles.calendar}
                />

                {/* Danh sách ca làm việc */}
                {shifts.map((s) => renderShift(s))}
            </ScrollView>

            {/* Overlay nền tối khi drawer mở */}
            {isDrawerOpen && (
                <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
            )}

            {/* Drawer (sidebar bên phải) */}
            <Animated.View
                style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}
            >
                <ScrollView>
                    {/* Header của Drawer */}
                    <View style={styles.drawerHeader}>
                        <Text style={styles.drawerTitle}>☰</Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addText}>＋</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Chế độ xem lịch */}
                    {["Tháng", "Tuần", "Ngày"].map((view, idx) => (
                        <Text
                            key={idx}
                            style={[styles.drawerItem, idx === 0 && styles.drawerItemActive]}
                        >
                            {view}
                        </Text>
                    ))}

                    {/* Danh sách nhân viên trong drawer */}
                    <Text style={styles.drawerUserTitle}>Nhân viên</Text>
                    {employees.slice(1).map((emp) => (
                        <View key={emp.id} style={styles.drawerEmp}>
                            {emp.avatar && (
                                <Image source={emp.avatar} style={styles.drawerAvatar} />
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.empName}>{emp.name}</Text>
                                <Text style={styles.empRole}>
                                    {emp.role} • {emp.type}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
};

// ==========================
// Styles
// ==========================
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    backBtn: { fontSize: 24 },
    title: { fontSize: 18, fontWeight: "bold", textAlign: "center", flex: 1 },
    menuBtn: { fontSize: 24 },

    // Picker
    pickerContainer: {
        marginHorizontal: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        alignSelf: "flex-start",
        overflow: "hidden",
    },
    picker: { height: 50, minWidth: 150, fontSize: 16, fontWeight: "bold" },

    // Calendar
    calendar: { marginBottom: 16 },

    // Shift block
    shiftCard: {
        flexDirection: "row",
        backgroundColor: "#f8f9fa",
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
    },
    shiftIconCol: {
        width: 50,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    shiftContentCol: { flex: 1 },
    shiftIcon: { fontSize: 24 },
    shiftTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
    empRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
    avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
    empName: { fontSize: 14, fontWeight: "600" },
    empRole: { fontSize: 12, color: "#666" },

    // Drawer
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    drawer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: width * 0.75,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: 40,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    drawerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: "#0cc",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    addText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    drawerTitle: { fontSize: 24, fontWeight: "bold", marginVertical: 8 },
    drawerUserTitle: { fontSize: 14, fontWeight: "bold", marginVertical: 8 },
    drawerItem: { fontSize: 16, marginVertical: 4 },
    drawerItemActive: { color: "#0cc", fontWeight: "bold" },
    drawerEmp: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: 8,
        borderRadius: 12,
        marginBottom: 8,
    },
    drawerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
});

export default ShiftScreen;