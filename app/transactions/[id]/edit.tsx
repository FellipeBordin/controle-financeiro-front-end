import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";

import { PageHeader } from "@/src/components/common/PageHeader";
import { ScreenContainer } from "@/src/components/common/ScreenContainer";
import { TransactionForm } from "@/src/components/Transactions/TransactionForm";
import { useEditTransaction } from "@/src/hooks/useEditTransaction";
import { colors } from "@/src/theme";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    title,
    amount,
    category,
    type,
    errors,
    loading,
    saving,
    setType,
    handleChangeTitle,
    handleChangeAmount,
    handleChangeCategory,
    handleSubmit,
  } = useEditTransaction({ id });

  if (loading) {
    return (
      <ScreenContainer
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader
        title="Editar lançamento"
        subtitle="Atualize os dados da receita ou despesa."
        onBack={() => router.back()}
      />

      <TransactionForm
        title={title}
        amount={amount}
        category={category}
        type={type}
        errors={errors}
        loading={saving}
        submitLabel="Salvar alterações"
        loadingLabel="Salvando..."
        onChangeTitle={handleChangeTitle}
        onChangeAmount={handleChangeAmount}
        onChangeCategory={handleChangeCategory}
        onChangeType={setType}
        onSubmit={() => {
          void handleSubmit();
        }}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}