/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateIncomingWebHookEvents = /* GraphQL */ `
  subscription OnCreateIncomingWebHookEvents(
    $filter: ModelSubscriptionIncomingWebHookEventsFilterInput
  ) {
    onCreateIncomingWebHookEvents(filter: $filter) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateIncomingWebHookEvents = /* GraphQL */ `
  subscription OnUpdateIncomingWebHookEvents(
    $filter: ModelSubscriptionIncomingWebHookEventsFilterInput
  ) {
    onUpdateIncomingWebHookEvents(filter: $filter) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteIncomingWebHookEvents = /* GraphQL */ `
  subscription OnDeleteIncomingWebHookEvents(
    $filter: ModelSubscriptionIncomingWebHookEventsFilterInput
  ) {
    onDeleteIncomingWebHookEvents(filter: $filter) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateApplicationEventLog = /* GraphQL */ `
  subscription OnCreateApplicationEventLog(
    $filter: ModelSubscriptionApplicationEventLogFilterInput
  ) {
    onCreateApplicationEventLog(filter: $filter) {
      id
      dateString
      name
      message
      status
      details
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateApplicationEventLog = /* GraphQL */ `
  subscription OnUpdateApplicationEventLog(
    $filter: ModelSubscriptionApplicationEventLogFilterInput
  ) {
    onUpdateApplicationEventLog(filter: $filter) {
      id
      dateString
      name
      message
      status
      details
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteApplicationEventLog = /* GraphQL */ `
  subscription OnDeleteApplicationEventLog(
    $filter: ModelSubscriptionApplicationEventLogFilterInput
  ) {
    onDeleteApplicationEventLog(filter: $filter) {
      id
      dateString
      name
      message
      status
      details
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMember = /* GraphQL */ `
  subscription OnCreateMember($filter: ModelSubscriptionMemberFilterInput) {
    onCreateMember(filter: $filter) {
      id
      username
      email
      forename
      surname
      siblings
      dateOfBirth
      gender
      profile
      ethnicity
      paymentHoliday
      enrolments {
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMember = /* GraphQL */ `
  subscription OnUpdateMember($filter: ModelSubscriptionMemberFilterInput) {
    onUpdateMember(filter: $filter) {
      id
      username
      email
      forename
      surname
      siblings
      dateOfBirth
      gender
      profile
      ethnicity
      paymentHoliday
      enrolments {
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMember = /* GraphQL */ `
  subscription OnDeleteMember($filter: ModelSubscriptionMemberFilterInput) {
    onDeleteMember(filter: $filter) {
      id
      username
      email
      forename
      surname
      siblings
      dateOfBirth
      gender
      profile
      ethnicity
      paymentHoliday
      enrolments {
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateEnrolment = /* GraphQL */ `
  subscription OnCreateEnrolment(
    $filter: ModelSubscriptionEnrolmentFilterInput
  ) {
    onCreateEnrolment(filter: $filter) {
      id
      bands
      status
      rate
      term
      main_member {
        id
        username
        email
        forename
        surname
        siblings
        dateOfBirth
        gender
        profile
        ethnicity
        paymentHoliday
        owner
        createdAt
        updatedAt
        __typename
      }
      memberEnrolmentsId
      bandMembershipType
      bandDesc
      bandRate
      lessons
      lessonDesc
      lessonRate
      stripeRef
      total
      giftAidConsent
      paymentName
      city
      line1
      line2
      postCode
      email
      firstname
      familyname
      instrumentsPlayed {
        Band
        Instrument
        __typename
      }
      owners
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateEnrolment = /* GraphQL */ `
  subscription OnUpdateEnrolment(
    $filter: ModelSubscriptionEnrolmentFilterInput
  ) {
    onUpdateEnrolment(filter: $filter) {
      id
      bands
      status
      rate
      term
      main_member {
        id
        username
        email
        forename
        surname
        siblings
        dateOfBirth
        gender
        profile
        ethnicity
        paymentHoliday
        owner
        createdAt
        updatedAt
        __typename
      }
      memberEnrolmentsId
      bandMembershipType
      bandDesc
      bandRate
      lessons
      lessonDesc
      lessonRate
      stripeRef
      total
      giftAidConsent
      paymentName
      city
      line1
      line2
      postCode
      email
      firstname
      familyname
      instrumentsPlayed {
        Band
        Instrument
        __typename
      }
      owners
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteEnrolment = /* GraphQL */ `
  subscription OnDeleteEnrolment(
    $filter: ModelSubscriptionEnrolmentFilterInput
  ) {
    onDeleteEnrolment(filter: $filter) {
      id
      bands
      status
      rate
      term
      main_member {
        id
        username
        email
        forename
        surname
        siblings
        dateOfBirth
        gender
        profile
        ethnicity
        paymentHoliday
        owner
        createdAt
        updatedAt
        __typename
      }
      memberEnrolmentsId
      bandMembershipType
      bandDesc
      bandRate
      lessons
      lessonDesc
      lessonRate
      stripeRef
      total
      giftAidConsent
      paymentName
      city
      line1
      line2
      postCode
      email
      firstname
      familyname
      instrumentsPlayed {
        Band
        Instrument
        __typename
      }
      owners
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateTerm = /* GraphQL */ `
  subscription OnCreateTerm($filter: ModelSubscriptionTermFilterInput) {
    onCreateTerm(filter: $filter) {
      id
      description
      startDate
      endDate
      bandpackages {
        nextToken
        __typename
      }
      lessonpackage {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTerm = /* GraphQL */ `
  subscription OnUpdateTerm($filter: ModelSubscriptionTermFilterInput) {
    onUpdateTerm(filter: $filter) {
      id
      description
      startDate
      endDate
      bandpackages {
        nextToken
        __typename
      }
      lessonpackage {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTerm = /* GraphQL */ `
  subscription OnDeleteTerm($filter: ModelSubscriptionTermFilterInput) {
    onDeleteTerm(filter: $filter) {
      id
      description
      startDate
      endDate
      bandpackages {
        nextToken
        __typename
      }
      lessonpackage {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateBandPackage = /* GraphQL */ `
  subscription OnCreateBandPackage(
    $filter: ModelSubscriptionBandPackageFilterInput
  ) {
    onCreateBandPackage(filter: $filter) {
      id
      description
      tariffs {
        applicableTo
        price
        __typename
      }
      bands {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      termBandpackagesId
      __typename
    }
  }
`;
export const onUpdateBandPackage = /* GraphQL */ `
  subscription OnUpdateBandPackage(
    $filter: ModelSubscriptionBandPackageFilterInput
  ) {
    onUpdateBandPackage(filter: $filter) {
      id
      description
      tariffs {
        applicableTo
        price
        __typename
      }
      bands {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      termBandpackagesId
      __typename
    }
  }
`;
export const onDeleteBandPackage = /* GraphQL */ `
  subscription OnDeleteBandPackage(
    $filter: ModelSubscriptionBandPackageFilterInput
  ) {
    onDeleteBandPackage(filter: $filter) {
      id
      description
      tariffs {
        applicableTo
        price
        __typename
      }
      bands {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      termBandpackagesId
      __typename
    }
  }
`;
export const onCreateBand = /* GraphQL */ `
  subscription OnCreateBand($filter: ModelSubscriptionBandFilterInput) {
    onCreateBand(filter: $filter) {
      id
      description
      package {
        nextToken
        __typename
      }
      active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBand = /* GraphQL */ `
  subscription OnUpdateBand($filter: ModelSubscriptionBandFilterInput) {
    onUpdateBand(filter: $filter) {
      id
      description
      package {
        nextToken
        __typename
      }
      active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBand = /* GraphQL */ `
  subscription OnDeleteBand($filter: ModelSubscriptionBandFilterInput) {
    onDeleteBand(filter: $filter) {
      id
      description
      package {
        nextToken
        __typename
      }
      active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateLessonPackage = /* GraphQL */ `
  subscription OnCreateLessonPackage(
    $filter: ModelSubscriptionLessonPackageFilterInput
  ) {
    onCreateLessonPackage(filter: $filter) {
      id
      description
      tariffs {
        applicableTo
        price
        __typename
      }
      createdAt
      updatedAt
      termLessonpackageId
      __typename
    }
  }
`;
export const onUpdateLessonPackage = /* GraphQL */ `
  subscription OnUpdateLessonPackage(
    $filter: ModelSubscriptionLessonPackageFilterInput
  ) {
    onUpdateLessonPackage(filter: $filter) {
      id
      description
      tariffs {
        applicableTo
        price
        __typename
      }
      createdAt
      updatedAt
      termLessonpackageId
      __typename
    }
  }
`;
export const onDeleteLessonPackage = /* GraphQL */ `
  subscription OnDeleteLessonPackage(
    $filter: ModelSubscriptionLessonPackageFilterInput
  ) {
    onDeleteLessonPackage(filter: $filter) {
      id
      description
      tariffs {
        applicableTo
        price
        __typename
      }
      createdAt
      updatedAt
      termLessonpackageId
      __typename
    }
  }
`;
export const onCreatePackageBands = /* GraphQL */ `
  subscription OnCreatePackageBands(
    $filter: ModelSubscriptionPackageBandsFilterInput
  ) {
    onCreatePackageBands(filter: $filter) {
      id
      bandPackageId
      bandId
      bandPackage {
        id
        description
        createdAt
        updatedAt
        termBandpackagesId
        __typename
      }
      band {
        id
        description
        active
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePackageBands = /* GraphQL */ `
  subscription OnUpdatePackageBands(
    $filter: ModelSubscriptionPackageBandsFilterInput
  ) {
    onUpdatePackageBands(filter: $filter) {
      id
      bandPackageId
      bandId
      bandPackage {
        id
        description
        createdAt
        updatedAt
        termBandpackagesId
        __typename
      }
      band {
        id
        description
        active
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePackageBands = /* GraphQL */ `
  subscription OnDeletePackageBands(
    $filter: ModelSubscriptionPackageBandsFilterInput
  ) {
    onDeletePackageBands(filter: $filter) {
      id
      bandPackageId
      bandId
      bandPackage {
        id
        description
        createdAt
        updatedAt
        termBandpackagesId
        __typename
      }
      band {
        id
        description
        active
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
