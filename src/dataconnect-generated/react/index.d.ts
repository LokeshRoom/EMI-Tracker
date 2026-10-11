import { CreateUserData, UpdateUserData, DeleteUserData, GetUserData, ListUsersData, CreateCreditCardData, CreateCreditCardVariables, UpdateCreditCardData, UpdateCreditCardVariables, DeleteCreditCardData, DeleteCreditCardVariables, GetCreditCardData, GetCreditCardVariables, ListCreditCardsData, CreateEmiData, CreateEmiVariables, UpdateEmiData, UpdateEmiVariables, DeleteEmiData, DeleteEmiVariables, GetEmiData, GetEmiVariables, ListEmIsData, CreatePaymentData, CreatePaymentVariables, UpdatePaymentData, UpdatePaymentVariables, DeletePaymentData, DeletePaymentVariables, GetPaymentData, GetPaymentVariables, ListPaymentsData, CreateReminderData, CreateReminderVariables, UpdateReminderData, UpdateReminderVariables, DeleteReminderData, DeleteReminderVariables, GetReminderData, GetReminderVariables, ListRemindersData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserData, undefined>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserData, undefined>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreateCreditCard(options?: useDataConnectMutationOptions<CreateCreditCardData, FirebaseError, CreateCreditCardVariables>): UseDataConnectMutationResult<CreateCreditCardData, CreateCreditCardVariables>;
export function useCreateCreditCard(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCreditCardData, FirebaseError, CreateCreditCardVariables>): UseDataConnectMutationResult<CreateCreditCardData, CreateCreditCardVariables>;

export function useUpdateCreditCard(options?: useDataConnectMutationOptions<UpdateCreditCardData, FirebaseError, UpdateCreditCardVariables>): UseDataConnectMutationResult<UpdateCreditCardData, UpdateCreditCardVariables>;
export function useUpdateCreditCard(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCreditCardData, FirebaseError, UpdateCreditCardVariables>): UseDataConnectMutationResult<UpdateCreditCardData, UpdateCreditCardVariables>;

export function useDeleteCreditCard(options?: useDataConnectMutationOptions<DeleteCreditCardData, FirebaseError, DeleteCreditCardVariables>): UseDataConnectMutationResult<DeleteCreditCardData, DeleteCreditCardVariables>;
export function useDeleteCreditCard(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCreditCardData, FirebaseError, DeleteCreditCardVariables>): UseDataConnectMutationResult<DeleteCreditCardData, DeleteCreditCardVariables>;

export function useGetCreditCard(vars: GetCreditCardVariables, options?: useDataConnectQueryOptions<GetCreditCardData>): UseDataConnectQueryResult<GetCreditCardData, GetCreditCardVariables>;
export function useGetCreditCard(dc: DataConnect, vars: GetCreditCardVariables, options?: useDataConnectQueryOptions<GetCreditCardData>): UseDataConnectQueryResult<GetCreditCardData, GetCreditCardVariables>;

export function useListCreditCards(options?: useDataConnectQueryOptions<ListCreditCardsData>): UseDataConnectQueryResult<ListCreditCardsData, undefined>;
export function useListCreditCards(dc: DataConnect, options?: useDataConnectQueryOptions<ListCreditCardsData>): UseDataConnectQueryResult<ListCreditCardsData, undefined>;

export function useCreateEmi(options?: useDataConnectMutationOptions<CreateEmiData, FirebaseError, CreateEmiVariables>): UseDataConnectMutationResult<CreateEmiData, CreateEmiVariables>;
export function useCreateEmi(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEmiData, FirebaseError, CreateEmiVariables>): UseDataConnectMutationResult<CreateEmiData, CreateEmiVariables>;

export function useUpdateEmi(options?: useDataConnectMutationOptions<UpdateEmiData, FirebaseError, UpdateEmiVariables>): UseDataConnectMutationResult<UpdateEmiData, UpdateEmiVariables>;
export function useUpdateEmi(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEmiData, FirebaseError, UpdateEmiVariables>): UseDataConnectMutationResult<UpdateEmiData, UpdateEmiVariables>;

export function useDeleteEmi(options?: useDataConnectMutationOptions<DeleteEmiData, FirebaseError, DeleteEmiVariables>): UseDataConnectMutationResult<DeleteEmiData, DeleteEmiVariables>;
export function useDeleteEmi(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteEmiData, FirebaseError, DeleteEmiVariables>): UseDataConnectMutationResult<DeleteEmiData, DeleteEmiVariables>;

export function useGetEmi(vars: GetEmiVariables, options?: useDataConnectQueryOptions<GetEmiData>): UseDataConnectQueryResult<GetEmiData, GetEmiVariables>;
export function useGetEmi(dc: DataConnect, vars: GetEmiVariables, options?: useDataConnectQueryOptions<GetEmiData>): UseDataConnectQueryResult<GetEmiData, GetEmiVariables>;

export function useListEmIs(options?: useDataConnectQueryOptions<ListEmIsData>): UseDataConnectQueryResult<ListEmIsData, undefined>;
export function useListEmIs(dc: DataConnect, options?: useDataConnectQueryOptions<ListEmIsData>): UseDataConnectQueryResult<ListEmIsData, undefined>;

export function useCreatePayment(options?: useDataConnectMutationOptions<CreatePaymentData, FirebaseError, CreatePaymentVariables>): UseDataConnectMutationResult<CreatePaymentData, CreatePaymentVariables>;
export function useCreatePayment(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePaymentData, FirebaseError, CreatePaymentVariables>): UseDataConnectMutationResult<CreatePaymentData, CreatePaymentVariables>;

export function useUpdatePayment(options?: useDataConnectMutationOptions<UpdatePaymentData, FirebaseError, UpdatePaymentVariables>): UseDataConnectMutationResult<UpdatePaymentData, UpdatePaymentVariables>;
export function useUpdatePayment(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePaymentData, FirebaseError, UpdatePaymentVariables>): UseDataConnectMutationResult<UpdatePaymentData, UpdatePaymentVariables>;

export function useDeletePayment(options?: useDataConnectMutationOptions<DeletePaymentData, FirebaseError, DeletePaymentVariables>): UseDataConnectMutationResult<DeletePaymentData, DeletePaymentVariables>;
export function useDeletePayment(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePaymentData, FirebaseError, DeletePaymentVariables>): UseDataConnectMutationResult<DeletePaymentData, DeletePaymentVariables>;

export function useGetPayment(vars: GetPaymentVariables, options?: useDataConnectQueryOptions<GetPaymentData>): UseDataConnectQueryResult<GetPaymentData, GetPaymentVariables>;
export function useGetPayment(dc: DataConnect, vars: GetPaymentVariables, options?: useDataConnectQueryOptions<GetPaymentData>): UseDataConnectQueryResult<GetPaymentData, GetPaymentVariables>;

export function useListPayments(options?: useDataConnectQueryOptions<ListPaymentsData>): UseDataConnectQueryResult<ListPaymentsData, undefined>;
export function useListPayments(dc: DataConnect, options?: useDataConnectQueryOptions<ListPaymentsData>): UseDataConnectQueryResult<ListPaymentsData, undefined>;

export function useCreateReminder(options?: useDataConnectMutationOptions<CreateReminderData, FirebaseError, CreateReminderVariables>): UseDataConnectMutationResult<CreateReminderData, CreateReminderVariables>;
export function useCreateReminder(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReminderData, FirebaseError, CreateReminderVariables>): UseDataConnectMutationResult<CreateReminderData, CreateReminderVariables>;

export function useUpdateReminder(options?: useDataConnectMutationOptions<UpdateReminderData, FirebaseError, UpdateReminderVariables>): UseDataConnectMutationResult<UpdateReminderData, UpdateReminderVariables>;
export function useUpdateReminder(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReminderData, FirebaseError, UpdateReminderVariables>): UseDataConnectMutationResult<UpdateReminderData, UpdateReminderVariables>;

export function useDeleteReminder(options?: useDataConnectMutationOptions<DeleteReminderData, FirebaseError, DeleteReminderVariables>): UseDataConnectMutationResult<DeleteReminderData, DeleteReminderVariables>;
export function useDeleteReminder(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReminderData, FirebaseError, DeleteReminderVariables>): UseDataConnectMutationResult<DeleteReminderData, DeleteReminderVariables>;

export function useGetReminder(vars: GetReminderVariables, options?: useDataConnectQueryOptions<GetReminderData>): UseDataConnectQueryResult<GetReminderData, GetReminderVariables>;
export function useGetReminder(dc: DataConnect, vars: GetReminderVariables, options?: useDataConnectQueryOptions<GetReminderData>): UseDataConnectQueryResult<GetReminderData, GetReminderVariables>;

export function useListReminders(options?: useDataConnectQueryOptions<ListRemindersData>): UseDataConnectQueryResult<ListRemindersData, undefined>;
export function useListReminders(dc: DataConnect, options?: useDataConnectQueryOptions<ListRemindersData>): UseDataConnectQueryResult<ListRemindersData, undefined>;
