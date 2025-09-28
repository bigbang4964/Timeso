import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// ================== DỮ LIỆU MẪU ================== //
// Danh sách ngày trong tuần
const days = [
    { date: "25", label: "Thứ 2" },
    { date: "26", label: "Thứ 3" },
    { date: "27", label: "Thứ 4" },
    { date: "28", label: "Thứ 5" },
    { date: "29", label: "Thứ 6" },
    { date: "30", label: "Thứ 7" },
    { date: "01", label: "CN" },
];

// Các mốc giờ hiển thị theo cột dọc
const hours = [
    "07:00","08:00","09:00","10:00","11:00",
    "12:00","13:00","14:00","15:00","16:00",
    "17:00","18:00","19:00","20:00",
];

const hourHeight = 50; // chiều cao cho mỗi block giờ

// Danh sách nhân viên (dùng cho Picker)
const employees = [
  { id: "0", name: "Tất cả nhân viên" },
  { id: "1", name: "Hương Thảo" },
  { id: "2", name: "Mai Anh" },
  { id: "3", name: "Tuấn Minh" },
  { id: "4", name: "Lê Bình An" },
];

// Danh sách ca làm việc (shift)
const shifts = [
    {
        icon: "☀️",
        title: "Ca sáng",
        start: "07:00",
        end: "11:00",
        style: "morning",
        members: [
          { id: "1", avatar: require("../assets/avatar1.jpg") },
          { id: "2", avatar: require("../assets/avatar2.jpg") },
        ],
        task: "Kiểm tra kho",
    },
    {
        icon: "🌞",
        title: "Ca trưa",
        start: "12:00",
        end: "16:00",
        style: "noon",
        members: [{ id: "1", avatar: require("../assets/avatar1.jpg") }],
        task: "Thiếu nv",
    },
    {
        icon: "🌙",
        title: "Ca tối",
        start: "17:00",
        end: "20:00",
        style: "night",
        members: [
          { id: "3", avatar: require("../assets/avatar3.jpg") },
          { id: "4", avatar: require("../assets/avatar4.jpg") },
        ],
        task: "Kiểm tra quầy",
    },
];

const WeeklyShiftScreen = ({ navigation }: any) => {
    const [selectedEmployee, setSelectedEmployee] = useState("0");

    // Tìm index của giờ trong mảng `hours`
    const getIndex = (time: string) => hours.indexOf(time);

    // Lọc ca làm việc theo nhân viên đã chọn (trên Picker)
    const filteredShifts = shifts.filter((s) => {
        if (selectedEmployee === "0") return true; // Hiển thị tất cả
        return s.members.some((m) => m.id === selectedEmployee);
    });

    return (
        <SafeAreaView style={styles.container}>
        {/* =============== HEADER =============== */}
        <View style={styles.header}>
            {/* Nút Back (chỉ hiển thị nếu có màn trước đó) */}
            {navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.backBtn}>←</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 24 }} /> // placeholder giữ tiêu đề ở giữa
            )}
            <Text style={styles.headerTitle}>Ca làm việc</Text>
            <TouchableOpacity>
                <Ionicons name="menu" size={24} color="#000" />
            </TouchableOpacity>
        </View>

        {/* =============== PICKER NHÂN VIÊN + TUẦN =============== */}
        <View style={styles.branchRow}>
            <View style={styles.pickerWrapper}>
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
            <Text style={styles.weekLabel}>25/04 - 01/05</Text>
        </View>

        {/* =============== CALENDAR VIEW =============== */}
        <ScrollView horizontal style={{ flex: 1 }}>
        <ScrollView>
            <View>
            {/* Hàng tiêu đề ngày */}
            <View style={styles.dayRow}>
                <View style={styles.timeCell}>
                    <Text style={styles.timeText}>Ngày/Giờ</Text>
                </View>
                {days.map((d, idx) => (
                  <View key={idx} style={styles.dayCell}>
                      <Text style={styles.dayDate}>{d.date}</Text>
                      <Text style={styles.dayLabel}>{d.label}</Text>
                  </View>
                ))}
            </View>

            {/* Grid ngày/giờ */}
            <View style={{ flexDirection: "row" }}>
                {/* Cột giờ bên trái */}
                <View>
                    {hours.map((h, idx) => (
                      <View key={idx} style={[styles.timeCell, { height: hourHeight }]}>
                          <Text style={styles.timeText}>{h}</Text>
                      </View>
                    ))}
                </View>

                {/* Các cột ngày */}
                {days.map((_, dayIdx) => (
                  <View
                      key={dayIdx}
                      style={{ width: 50, borderLeftWidth: 1, borderColor: "#eee" }}
                  >
                      {/* Ô giờ trống */}
                      {hours.map((_, idx) => (
                        <View
                            key={idx}
                            style={{
                                height: hourHeight,
                                borderBottomWidth: 1,
                                borderColor: "#eee",
                            }}
                        />
                      ))}

                      {/* Shift block hiển thị trong từng ngày */}
                      {filteredShifts.map((s, shiftIdx) => {
                          const startIdx = getIndex(s.start);
                          const endIdx = getIndex(s.end);
                          if (startIdx === -1 || endIdx === -1) return null;

                          const top = startIdx * hourHeight;
                          const height = (endIdx - startIdx + 1) * hourHeight;

                          return (
                              <View
                                key={shiftIdx}
                                style={[
                                  styles.shiftBlock,
                                  styles[s.style as keyof typeof styles] as any,
                                  { top, height, position: "absolute", left: 2, right: 2 },
                                ]}
                              >
                                {/* Icon ca làm */}
                                <Text style={styles.shiftIcon}>{s.icon}</Text>

                                {/* Tên ca */}
                                <Text style={styles.shiftTitle}>{s.title}</Text>

                                {/* Avatars nhân viên (xếp dọc) */}
                                <View style={styles.avatarColumn}>
                                    {s.members.map((m, i) => (
                                      <Image key={i} source={m.avatar} style={styles.avatar} />
                                    ))}
                                </View>

                                {/* Nhiệm vụ */}
                                <Text style={styles.taskText}>{s.task}</Text>
                              </View>
                          );
                      })}
                  </View>
                ))}
            </View>
            </View>
        </ScrollView>
        </ScrollView>

        {/* =============== ĐỀ XUẤT NHÂN VIÊN =============== */}
        <View style={styles.suggestContainer}>
            <Text style={styles.suggestTitle}>Đề xuất nhân viên</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* Nút AutoCa */}
                <TouchableOpacity style={styles.autoCaButton}>
                    <Text style={styles.autoCaIcon}>✨</Text>
                    <Text style={styles.autoCaText}>AutoCa</Text>
                </TouchableOpacity>

                {/* Card nhân viên gợi ý */}
                <View style={styles.staffCard}>
                    <Image source={ require("../assets/avatar3.jpg") } style={styles.staffAvatar} />
                    <View>
                        <Text style={styles.staffName}>Hương Thảo</Text>
                        <Text style={styles.staffRole}>Nv bán hàng · Parttime</Text>
                    </View>
                </View>

                <View style={styles.staffCard}>
                    <Image source={require("../assets/avatar3.jpg")} style={styles.staffAvatar} />
                    <View>
                        <Text style={styles.staffName}>Lê Tuấn</Text>
                        <Text style={styles.staffRole}>Nv bán hàng · Parttime</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  );
};

// ================== STYLE ================== //
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    // Header
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    backBtn: { fontSize: 24 },

    // Picker
    branchRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10, alignItems: "center" },
    pickerWrapper: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden" },
    picker: { height: 56, width: 160 },
    weekLabel: { fontSize: 14, fontWeight: "500", color: "#0cc" },

    // Calendar
    dayRow: { flexDirection: "row" },
    dayCell: { width: 50, height: 50, borderWidth: 1, borderColor: "#eee", justifyContent: "center", alignItems: "center" },
    dayDate: { fontSize: 16, fontWeight: "bold" },
    dayLabel: { fontSize: 12, color: "#666" },
    timeCell: { width: 50, height: 50, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#eee" },
    timeText: { fontSize: 12, color: "#666" },

    // Shift block
    shiftBlock: { width: 45, borderRadius: 8, padding: 5, justifyContent: "flex-start", alignItems: "center", flexDirection: "column" },
    shiftIcon: { fontSize: 16, marginBottom: 4 },
    shiftTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
    avatarColumn: { flexDirection: "column", alignItems: "center", marginBottom: 6 },
    avatar: { width: 28, height: 28, borderRadius: 14, marginVertical: 4 },
    taskText: { fontSize: 10, color: "#444" },

    // Suggest
    suggestContainer: { borderTopWidth: 1, borderColor: "#eee", padding: 12, backgroundColor: "#fff" },
    suggestTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
    autoCaButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E6FAFA", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10 },
    autoCaIcon: { marginRight: 6, fontSize: 16 },
    autoCaText: { color: "#00B7B7", fontWeight: "600" },
    staffCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10, borderWidth: 1, borderColor: "#eee" },
    staffAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
    staffName: { fontSize: 14, fontWeight: "600" },
    staffRole: { fontSize: 12, color: "gray" },

    // Màu nền cho ca
    morning: { backgroundColor: "#fff9e6", borderColor: "#ffd27f", borderWidth: 1 },
    noon: { backgroundColor: "#ffe6e6", borderColor: "#ff9999", borderWidth: 1 },
    night: { backgroundColor: "#f0e6ff", borderColor: "#b399ff", borderWidth: 1 },
});

export default WeeklyShiftScreen;