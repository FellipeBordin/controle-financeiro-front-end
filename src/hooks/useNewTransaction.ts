import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { transactionCategories } from "@/src/constants/transactionCategories";
import { createTransaction } from "@/src/services/transactions";
import type { TransactionType } from "@/src/types/transaction";
import { parseCurrency } from "@/src/utils/currency";
import {
  validateTransaction,
  validateTransactionAmount,
} from "@/src/utils/transactionValidators";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function useNewTransaction() {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(transactionCategories.expense[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const availableCategories = transactionCategories[type];

  function handleChangeType(newType: TransactionType) {
    setType(newType);
    setCategory(transactionCategories[newType][0]);
  }

  async function handleCreate() {
    const validationError = validateTransaction({
      title,
      amount,
      category,
    });

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const parsedAmount = parseCurrency(amount);

    const amountError = validateTransactionAmount(parsedAmount);

    if (amountError) {
      Alert.alert("Atenção", amountError);
      return;
    }

    try {
      setLoading(true);

      await createTransaction({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date: new Date().toISOString(),
        notes: notes.trim(),
      });

      Alert.alert("Sucesso", "Lançamento cadastrado.");
      router.replace("/home");
   } catch (error) {
  console.error("Erro ao cadastrar lançamento:", error);

  const message = getApiErrorMessage(
    error,
    "Não foi possível cadastrar o lançamento.",
  );

  Alert.alert("Erro", message);
}finally {
      setLoading(false);
    }
  }

  return {
    type,
    title,
    amount,
    category,
    notes,
    loading,
    availableCategories,
    setTitle,
    setAmount,
    setCategory,
    setNotes,
    handleChangeType,
    handleCreate,
  };
}
