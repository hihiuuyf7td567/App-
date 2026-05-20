import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getAllCoursesWithStops } from "@/db/database";
import type { CourseWithStops } from "@/db/types";
import { ParProfile } from "@/components/ParProfile";

export default function DebugScreen() {
  const [courses, setCourses] = useState<CourseWithStops[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCoursesWithStops()
      .then(setCourses)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FAC775" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>Data layer debug</Text>
      <Text style={styles.meta}>
        {courses.length} courses ·{" "}
        {courses.reduce((n, c) => n + c.stops.length, 0)} stops · 12 bars
        seeded
      </Text>

      {/* ParProfile at three sizes */}
      <Text style={styles.sectionLabel}>ParProfile — large (full width)</Text>
      {courses.map((c) => (
        <View key={c.id + "-lg"} style={styles.profileRow}>
          <Text style={styles.profileLabel}>{c.name}</Text>
          <ParProfile
            pars={c.stops.map((s) => s.bar.baselinePar)}
            width={320}
            height={80}
          />
        </View>
      ))}

      <Text style={styles.sectionLabel}>ParProfile — card size</Text>
      <View style={styles.cardRow}>
        {courses.map((c) => (
          <View key={c.id + "-md"} style={styles.miniCard}>
            <ParProfile
              pars={c.stops.map((s) => s.bar.baselinePar)}
              width={96}
              height={36}
            />
            <Text style={styles.miniLabel}>{c.name}</Text>
          </View>
        ))}
      </View>

      {/* Course data tables */}
      {courses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseName}>{course.name}</Text>
            {course.isFeatured && (
              <Text style={styles.featuredBadge}>featured</Text>
            )}
          </View>
          <Text style={styles.courseTagline}>{course.tagline}</Text>

          <View style={styles.parRow}>
            <Text style={styles.parLabel}>Course par</Text>
            <Text style={styles.parValue}>{course.coursePar}</Text>
          </View>

          <View style={styles.stopsTable}>
            <View style={styles.tableHeader}>
              <Text
                style={[styles.tableCell, styles.tableHeadText, styles.colPos]}
              >
                #
              </Text>
              <Text
                style={[styles.tableCell, styles.tableHeadText, styles.colName]}
              >
                Bar
              </Text>
              <Text
                style={[styles.tableCell, styles.tableHeadText, styles.colType]}
              >
                Type
              </Text>
              <Text
                style={[styles.tableCell, styles.tableHeadText, styles.colPar]}
              >
                Par
              </Text>
            </View>

            {course.stops.map((stop) => (
              <View key={stop.barId} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colPos, styles.cellText]}>
                  {stop.position}
                </Text>
                <Text
                  style={[styles.tableCell, styles.colName, styles.cellText]}
                >
                  {stop.bar.name}
                </Text>
                <Text
                  style={[styles.tableCell, styles.colType, styles.cellMuted]}
                >
                  {stop.bar.type}
                </Text>
                <Text style={[styles.tableCell, styles.colPar, styles.parNum]}>
                  {stop.bar.baselinePar}
                </Text>
              </View>
            ))}

            <View style={styles.tableFoot}>
              <Text style={[styles.tableCell, styles.colPos]} />
              <Text style={[styles.tableCell, styles.colName, styles.footText]}>
                Total
              </Text>
              <Text style={[styles.tableCell, styles.colType]} />
              <Text style={[styles.tableCell, styles.colPar, styles.footPar]}>
                {course.coursePar}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#111" },
  container: { padding: 16, paddingBottom: 48 },
  center: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { color: "#ff6b6b", fontSize: 14 },

  screenTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 4,
  },
  meta: { color: "#666", fontSize: 12, marginBottom: 24 },

  sectionLabel: {
    color: "#555",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 8,
  },
  profileRow: { marginBottom: 16 },
  profileLabel: { color: "#888", fontSize: 12, marginBottom: 6 },
  cardRow: { flexDirection: "row", gap: 12, marginBottom: 24, flexWrap: "wrap" },
  miniCard: { alignItems: "center", gap: 6 },
  miniLabel: { color: "#666", fontSize: 10, textAlign: "center", maxWidth: 96 },

  courseCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#2a2a2a",
    padding: 16,
    marginBottom: 20,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  courseName: { color: "#fff", fontSize: 16, fontWeight: "500", flex: 1 },
  featuredBadge: {
    color: "#FAC775",
    fontSize: 11,
    borderWidth: 1,
    borderColor: "#BA7517",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  courseTagline: { color: "#888", fontSize: 13, marginBottom: 12 },

  parRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  parLabel: { color: "#666", fontSize: 12, flex: 1 },
  parValue: { color: "#FAC775", fontSize: 18, fontWeight: "500" },

  stopsTable: { borderTopWidth: 0.5, borderColor: "#2a2a2a" },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#2a2a2a",
  },
  tableHeadText: { color: "#555", fontSize: 11, textTransform: "uppercase" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderColor: "#1e1e1e",
  },
  tableFoot: { flexDirection: "row", paddingVertical: 8 },
  tableCell: { paddingHorizontal: 2 },
  cellText: { color: "#ddd", fontSize: 13 },
  cellMuted: { color: "#666", fontSize: 13 },
  parNum: { color: "#FAC775", fontSize: 13, textAlign: "right" },
  footText: { color: "#888", fontSize: 12, fontStyle: "italic" },
  footPar: {
    color: "#FAC775",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },

  colPos: { width: 24 },
  colName: { flex: 1 },
  colType: { width: 110 },
  colPar: { width: 32, textAlign: "right" },
});
