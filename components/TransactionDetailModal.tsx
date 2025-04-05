import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native"
import { X, ArrowUpRight, ArrowDownRight, Calendar, Tag, FileText } from "lucide-react-native"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"
import type { Transaction } from "../context/TransactionContext"

interface TransactionDetailModalProps {
  isVisible: boolean
  transaction: Transaction | null
  onClose: () => void
}

const TransactionDetailModal = ({ isVisible, transaction, onClose }: TransactionDetailModalProps) => {
  const { format } = useCurrency()

  if (!transaction) return null

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de Transacción</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="white" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.amountContainer}>
              <View
                style={[
                  styles.typeIconContainer,
                  {
                    backgroundColor:
                      transaction.type === "income" ? theme.colors.successLight : theme.colors.dangerLight,
                  },
                ]}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight color={theme.colors.success} size={24} />
                ) : (
                  <ArrowDownRight color={theme.colors.danger} size={24} />
                )}
              </View>
              <Text
                style={[
                  styles.amountText,
                  { color: transaction.type === "income" ? theme.colors.success : theme.colors.danger },
                ]}
              >
                {transaction.type === "income" ? "+" : "-"} {format(transaction.amount)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Tag color={theme.colors.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Categoría</Text>
                <Text style={styles.detailValue}>{transaction.category}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Calendar color={theme.colors.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha</Text>
                <Text style={styles.detailValue}>{new Date(transaction.date).toLocaleDateString()}</Text>
              </View>
            </View>

            {transaction.description && (
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <FileText color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Descripción</Text>
                  <Text style={styles.detailValue}>{transaction.description}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  amountText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    backgroundColor: theme.colors.cardAlt,
    borderRadius: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: "500",
  },
})

export default TransactionDetailModal

