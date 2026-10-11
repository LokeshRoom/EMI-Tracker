import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateCreditCardData {
  creditCard_insert: CreditCard_Key;
}

export interface CreateCreditCardVariables {
  nickname: string;
  issuerName: string;
  lastFourDigits: string;
}

export interface CreateEmiData {
  eMI_insert: EMI_Key;
}

export interface CreateEmiVariables {
  purchaseName: string;
  totalAmount: number;
  monthlyAmount: number;
  interestRate: number;
  totalInstallments: number;
  startDate: DateString;
  nextDueDate: DateString;
  creditCardId: UUIDString;
}

export interface CreatePaymentData {
  payment_insert: Payment_Key;
}

export interface CreatePaymentVariables {
  paymentDate: DateString;
  amountPaid: number;
  status: string;
  emiId: UUIDString;
}

export interface CreateReminderData {
  reminder_insert: Reminder_Key;
}

export interface CreateReminderVariables {
  leadDays: number;
  isEnabled: boolean;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreditCard_Key {
  id: UUIDString;
  __typename?: 'CreditCard_Key';
}

export interface DeleteCreditCardData {
  creditCard_delete?: CreditCard_Key | null;
}

export interface DeleteCreditCardVariables {
  id: UUIDString;
}

export interface DeleteEmiData {
  eMI_delete?: EMI_Key | null;
}

export interface DeleteEmiVariables {
  id: UUIDString;
}

export interface DeletePaymentData {
  payment_delete?: Payment_Key | null;
}

export interface DeletePaymentVariables {
  id: UUIDString;
}

export interface DeleteReminderData {
  reminder_delete?: Reminder_Key | null;
}

export interface DeleteReminderVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface EMI_Key {
  id: UUIDString;
  __typename?: 'EMI_Key';
}

export interface GetCreditCardData {
  creditCard?: {
    nickname: string;
    issuerName: string;
  };
}

export interface GetCreditCardVariables {
  id: UUIDString;
}

export interface GetEmiData {
  eMI?: {
    purchaseName: string;
    totalAmount: number;
  };
}

export interface GetEmiVariables {
  id: UUIDString;
}

export interface GetPaymentData {
  payment?: {
    amountPaid: number;
    paymentDate: DateString;
  };
}

export interface GetPaymentVariables {
  id: UUIDString;
}

export interface GetReminderData {
  reminder?: {
    leadDays: number;
    isEnabled: boolean;
  };
}

export interface GetReminderVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    email: string;
    name: string;
  };
}

export interface ListCreditCardsData {
  creditCards: ({
    nickname: string;
    lastFourDigits: string;
  })[];
}

export interface ListEmIsData {
  eMIS: ({
    purchaseName: string;
    nextDueDate: DateString;
  })[];
}

export interface ListPaymentsData {
  payments: ({
    amountPaid: number;
    status: string;
  })[];
}

export interface ListRemindersData {
  reminders: ({
    leadDays: number;
    isEnabled: boolean;
  })[];
}

export interface ListUsersData {
  users: ({
    name: string;
  })[];
}

export interface Payment_Key {
  id: UUIDString;
  __typename?: 'Payment_Key';
}

export interface Reminder_Key {
  id: UUIDString;
  __typename?: 'Reminder_Key';
}

export interface UpdateCreditCardData {
  creditCard_update?: CreditCard_Key | null;
}

export interface UpdateCreditCardVariables {
  id: UUIDString;
  nickname: string;
}

export interface UpdateEmiData {
  eMI_update?: EMI_Key | null;
}

export interface UpdateEmiVariables {
  id: UUIDString;
  status: string;
}

export interface UpdatePaymentData {
  payment_update?: Payment_Key | null;
}

export interface UpdatePaymentVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateReminderData {
  reminder_update?: Reminder_Key | null;
}

export interface UpdateReminderVariables {
  id: UUIDString;
  isEnabled: boolean;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateUserData, undefined>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(): MutationPromise<UpdateUserData, undefined>;
export function updateUser(dc: DataConnect): MutationPromise<UpdateUserData, undefined>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateCreditCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCreditCardVariables): MutationRef<CreateCreditCardData, CreateCreditCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCreditCardVariables): MutationRef<CreateCreditCardData, CreateCreditCardVariables>;
  operationName: string;
}
export const createCreditCardRef: CreateCreditCardRef;

export function createCreditCard(vars: CreateCreditCardVariables): MutationPromise<CreateCreditCardData, CreateCreditCardVariables>;
export function createCreditCard(dc: DataConnect, vars: CreateCreditCardVariables): MutationPromise<CreateCreditCardData, CreateCreditCardVariables>;

interface UpdateCreditCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCreditCardVariables): MutationRef<UpdateCreditCardData, UpdateCreditCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCreditCardVariables): MutationRef<UpdateCreditCardData, UpdateCreditCardVariables>;
  operationName: string;
}
export const updateCreditCardRef: UpdateCreditCardRef;

export function updateCreditCard(vars: UpdateCreditCardVariables): MutationPromise<UpdateCreditCardData, UpdateCreditCardVariables>;
export function updateCreditCard(dc: DataConnect, vars: UpdateCreditCardVariables): MutationPromise<UpdateCreditCardData, UpdateCreditCardVariables>;

interface DeleteCreditCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCreditCardVariables): MutationRef<DeleteCreditCardData, DeleteCreditCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCreditCardVariables): MutationRef<DeleteCreditCardData, DeleteCreditCardVariables>;
  operationName: string;
}
export const deleteCreditCardRef: DeleteCreditCardRef;

export function deleteCreditCard(vars: DeleteCreditCardVariables): MutationPromise<DeleteCreditCardData, DeleteCreditCardVariables>;
export function deleteCreditCard(dc: DataConnect, vars: DeleteCreditCardVariables): MutationPromise<DeleteCreditCardData, DeleteCreditCardVariables>;

interface GetCreditCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCreditCardVariables): QueryRef<GetCreditCardData, GetCreditCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCreditCardVariables): QueryRef<GetCreditCardData, GetCreditCardVariables>;
  operationName: string;
}
export const getCreditCardRef: GetCreditCardRef;

export function getCreditCard(vars: GetCreditCardVariables, options?: ExecuteQueryOptions): QueryPromise<GetCreditCardData, GetCreditCardVariables>;
export function getCreditCard(dc: DataConnect, vars: GetCreditCardVariables, options?: ExecuteQueryOptions): QueryPromise<GetCreditCardData, GetCreditCardVariables>;

interface ListCreditCardsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCreditCardsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCreditCardsData, undefined>;
  operationName: string;
}
export const listCreditCardsRef: ListCreditCardsRef;

export function listCreditCards(options?: ExecuteQueryOptions): QueryPromise<ListCreditCardsData, undefined>;
export function listCreditCards(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCreditCardsData, undefined>;

interface CreateEmiRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmiVariables): MutationRef<CreateEmiData, CreateEmiVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmiVariables): MutationRef<CreateEmiData, CreateEmiVariables>;
  operationName: string;
}
export const createEmiRef: CreateEmiRef;

export function createEmi(vars: CreateEmiVariables): MutationPromise<CreateEmiData, CreateEmiVariables>;
export function createEmi(dc: DataConnect, vars: CreateEmiVariables): MutationPromise<CreateEmiData, CreateEmiVariables>;

interface UpdateEmiRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmiVariables): MutationRef<UpdateEmiData, UpdateEmiVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmiVariables): MutationRef<UpdateEmiData, UpdateEmiVariables>;
  operationName: string;
}
export const updateEmiRef: UpdateEmiRef;

export function updateEmi(vars: UpdateEmiVariables): MutationPromise<UpdateEmiData, UpdateEmiVariables>;
export function updateEmi(dc: DataConnect, vars: UpdateEmiVariables): MutationPromise<UpdateEmiData, UpdateEmiVariables>;

interface DeleteEmiRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmiVariables): MutationRef<DeleteEmiData, DeleteEmiVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEmiVariables): MutationRef<DeleteEmiData, DeleteEmiVariables>;
  operationName: string;
}
export const deleteEmiRef: DeleteEmiRef;

export function deleteEmi(vars: DeleteEmiVariables): MutationPromise<DeleteEmiData, DeleteEmiVariables>;
export function deleteEmi(dc: DataConnect, vars: DeleteEmiVariables): MutationPromise<DeleteEmiData, DeleteEmiVariables>;

interface GetEmiRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmiVariables): QueryRef<GetEmiData, GetEmiVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEmiVariables): QueryRef<GetEmiData, GetEmiVariables>;
  operationName: string;
}
export const getEmiRef: GetEmiRef;

export function getEmi(vars: GetEmiVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmiData, GetEmiVariables>;
export function getEmi(dc: DataConnect, vars: GetEmiVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmiData, GetEmiVariables>;

interface ListEmIsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmIsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEmIsData, undefined>;
  operationName: string;
}
export const listEmIsRef: ListEmIsRef;

export function listEmIs(options?: ExecuteQueryOptions): QueryPromise<ListEmIsData, undefined>;
export function listEmIs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmIsData, undefined>;

interface CreatePaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
  operationName: string;
}
export const createPaymentRef: CreatePaymentRef;

export function createPayment(vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;
export function createPayment(dc: DataConnect, vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface UpdatePaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentVariables): MutationRef<UpdatePaymentData, UpdatePaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePaymentVariables): MutationRef<UpdatePaymentData, UpdatePaymentVariables>;
  operationName: string;
}
export const updatePaymentRef: UpdatePaymentRef;

export function updatePayment(vars: UpdatePaymentVariables): MutationPromise<UpdatePaymentData, UpdatePaymentVariables>;
export function updatePayment(dc: DataConnect, vars: UpdatePaymentVariables): MutationPromise<UpdatePaymentData, UpdatePaymentVariables>;

interface DeletePaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
  operationName: string;
}
export const deletePaymentRef: DeletePaymentRef;

export function deletePayment(vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;
export function deletePayment(dc: DataConnect, vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;

interface GetPaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
  operationName: string;
}
export const getPaymentRef: GetPaymentRef;

export function getPayment(vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;
export function getPayment(dc: DataConnect, vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;

interface ListPaymentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPaymentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPaymentsData, undefined>;
  operationName: string;
}
export const listPaymentsRef: ListPaymentsRef;

export function listPayments(options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;
export function listPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;

interface CreateReminderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReminderVariables): MutationRef<CreateReminderData, CreateReminderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReminderVariables): MutationRef<CreateReminderData, CreateReminderVariables>;
  operationName: string;
}
export const createReminderRef: CreateReminderRef;

export function createReminder(vars: CreateReminderVariables): MutationPromise<CreateReminderData, CreateReminderVariables>;
export function createReminder(dc: DataConnect, vars: CreateReminderVariables): MutationPromise<CreateReminderData, CreateReminderVariables>;

interface UpdateReminderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReminderVariables): MutationRef<UpdateReminderData, UpdateReminderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReminderVariables): MutationRef<UpdateReminderData, UpdateReminderVariables>;
  operationName: string;
}
export const updateReminderRef: UpdateReminderRef;

export function updateReminder(vars: UpdateReminderVariables): MutationPromise<UpdateReminderData, UpdateReminderVariables>;
export function updateReminder(dc: DataConnect, vars: UpdateReminderVariables): MutationPromise<UpdateReminderData, UpdateReminderVariables>;

interface DeleteReminderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReminderVariables): MutationRef<DeleteReminderData, DeleteReminderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReminderVariables): MutationRef<DeleteReminderData, DeleteReminderVariables>;
  operationName: string;
}
export const deleteReminderRef: DeleteReminderRef;

export function deleteReminder(vars: DeleteReminderVariables): MutationPromise<DeleteReminderData, DeleteReminderVariables>;
export function deleteReminder(dc: DataConnect, vars: DeleteReminderVariables): MutationPromise<DeleteReminderData, DeleteReminderVariables>;

interface GetReminderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReminderVariables): QueryRef<GetReminderData, GetReminderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReminderVariables): QueryRef<GetReminderData, GetReminderVariables>;
  operationName: string;
}
export const getReminderRef: GetReminderRef;

export function getReminder(vars: GetReminderVariables, options?: ExecuteQueryOptions): QueryPromise<GetReminderData, GetReminderVariables>;
export function getReminder(dc: DataConnect, vars: GetReminderVariables, options?: ExecuteQueryOptions): QueryPromise<GetReminderData, GetReminderVariables>;

interface ListRemindersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRemindersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListRemindersData, undefined>;
  operationName: string;
}
export const listRemindersRef: ListRemindersRef;

export function listReminders(options?: ExecuteQueryOptions): QueryPromise<ListRemindersData, undefined>;
export function listReminders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRemindersData, undefined>;

