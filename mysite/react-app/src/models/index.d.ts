import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerEnrolment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Enrolment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly bands?: (string | null)[] | null;
  readonly status?: string | null;
  readonly term?: string | null;
  readonly bandDesc?: string | null;
  readonly bandRate?: number | null;
  readonly lessons?: boolean | null;
  readonly lessonDesc?: number | null;
  readonly lessonRate?: string | null;
  readonly stripeRef?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyEnrolment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Enrolment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly bands?: (string | null)[] | null;
  readonly status?: string | null;
  readonly term?: string | null;
  readonly bandDesc?: string | null;
  readonly bandRate?: number | null;
  readonly lessons?: boolean | null;
  readonly lessonDesc?: number | null;
  readonly lessonRate?: string | null;
  readonly stripeRef?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Enrolment = LazyLoading extends LazyLoadingDisabled ? EagerEnrolment : LazyEnrolment

export declare const Enrolment: (new (init: ModelInit<Enrolment>) => Enrolment) & {
  copyOf(source: Enrolment, mutator: (draft: MutableModel<Enrolment>) => MutableModel<Enrolment> | void): Enrolment;
}