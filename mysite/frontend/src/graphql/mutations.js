/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createIncomingWebHookEvents = /* GraphQL */ `
  mutation CreateIncomingWebHookEvents(
    $input: CreateIncomingWebHookEventsInput!
    $condition: ModelIncomingWebHookEventsConditionInput
  ) {
    createIncomingWebHookEvents(input: $input, condition: $condition) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateIncomingWebHookEvents = /* GraphQL */ `
  mutation UpdateIncomingWebHookEvents(
    $input: UpdateIncomingWebHookEventsInput!
    $condition: ModelIncomingWebHookEventsConditionInput
  ) {
    updateIncomingWebHookEvents(input: $input, condition: $condition) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteIncomingWebHookEvents = /* GraphQL */ `
  mutation DeleteIncomingWebHookEvents(
    $input: DeleteIncomingWebHookEventsInput!
    $condition: ModelIncomingWebHookEventsConditionInput
  ) {
    deleteIncomingWebHookEvents(input: $input, condition: $condition) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createApplicationEventLog = /* GraphQL */ `
  mutation CreateApplicationEventLog(
    $input: CreateApplicationEventLogInput!
    $condition: ModelApplicationEventLogConditionInput
  ) {
    createApplicationEventLog(input: $input, condition: $condition) {
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
export const updateApplicationEventLog = /* GraphQL */ `
  mutation UpdateApplicationEventLog(
    $input: UpdateApplicationEventLogInput!
    $condition: ModelApplicationEventLogConditionInput
  ) {
    updateApplicationEventLog(input: $input, condition: $condition) {
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
export const deleteApplicationEventLog = /* GraphQL */ `
  mutation DeleteApplicationEventLog(
    $input: DeleteApplicationEventLogInput!
    $condition: ModelApplicationEventLogConditionInput
  ) {
    deleteApplicationEventLog(input: $input, condition: $condition) {
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
export const createMember = /* GraphQL */ `
  mutation CreateMember(
    $input: CreateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    createMember(input: $input, condition: $condition) {
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
export const updateMember = /* GraphQL */ `
  mutation UpdateMember(
    $input: UpdateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    updateMember(input: $input, condition: $condition) {
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
export const deleteMember = /* GraphQL */ `
  mutation DeleteMember(
    $input: DeleteMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    deleteMember(input: $input, condition: $condition) {
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
export const createEnrolment = /* GraphQL */ `
  mutation CreateEnrolment(
    $input: CreateEnrolmentInput!
    $condition: ModelEnrolmentConditionInput
  ) {
    createEnrolment(input: $input, condition: $condition) {
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
export const updateEnrolment = /* GraphQL */ `
  mutation UpdateEnrolment(
    $input: UpdateEnrolmentInput!
    $condition: ModelEnrolmentConditionInput
  ) {
    updateEnrolment(input: $input, condition: $condition) {
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
export const deleteEnrolment = /* GraphQL */ `
  mutation DeleteEnrolment(
    $input: DeleteEnrolmentInput!
    $condition: ModelEnrolmentConditionInput
  ) {
    deleteEnrolment(input: $input, condition: $condition) {
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
export const createTerm = /* GraphQL */ `
  mutation CreateTerm(
    $input: CreateTermInput!
    $condition: ModelTermConditionInput
  ) {
    createTerm(input: $input, condition: $condition) {
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
export const updateTerm = /* GraphQL */ `
  mutation UpdateTerm(
    $input: UpdateTermInput!
    $condition: ModelTermConditionInput
  ) {
    updateTerm(input: $input, condition: $condition) {
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
export const deleteTerm = /* GraphQL */ `
  mutation DeleteTerm(
    $input: DeleteTermInput!
    $condition: ModelTermConditionInput
  ) {
    deleteTerm(input: $input, condition: $condition) {
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
export const createBandPackage = /* GraphQL */ `
  mutation CreateBandPackage(
    $input: CreateBandPackageInput!
    $condition: ModelBandPackageConditionInput
  ) {
    createBandPackage(input: $input, condition: $condition) {
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
export const updateBandPackage = /* GraphQL */ `
  mutation UpdateBandPackage(
    $input: UpdateBandPackageInput!
    $condition: ModelBandPackageConditionInput
  ) {
    updateBandPackage(input: $input, condition: $condition) {
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
export const deleteBandPackage = /* GraphQL */ `
  mutation DeleteBandPackage(
    $input: DeleteBandPackageInput!
    $condition: ModelBandPackageConditionInput
  ) {
    deleteBandPackage(input: $input, condition: $condition) {
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
export const createBand = /* GraphQL */ `
  mutation CreateBand(
    $input: CreateBandInput!
    $condition: ModelBandConditionInput
  ) {
    createBand(input: $input, condition: $condition) {
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
export const updateBand = /* GraphQL */ `
  mutation UpdateBand(
    $input: UpdateBandInput!
    $condition: ModelBandConditionInput
  ) {
    updateBand(input: $input, condition: $condition) {
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
export const deleteBand = /* GraphQL */ `
  mutation DeleteBand(
    $input: DeleteBandInput!
    $condition: ModelBandConditionInput
  ) {
    deleteBand(input: $input, condition: $condition) {
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
export const createLessonPackage = /* GraphQL */ `
  mutation CreateLessonPackage(
    $input: CreateLessonPackageInput!
    $condition: ModelLessonPackageConditionInput
  ) {
    createLessonPackage(input: $input, condition: $condition) {
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
export const updateLessonPackage = /* GraphQL */ `
  mutation UpdateLessonPackage(
    $input: UpdateLessonPackageInput!
    $condition: ModelLessonPackageConditionInput
  ) {
    updateLessonPackage(input: $input, condition: $condition) {
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
export const deleteLessonPackage = /* GraphQL */ `
  mutation DeleteLessonPackage(
    $input: DeleteLessonPackageInput!
    $condition: ModelLessonPackageConditionInput
  ) {
    deleteLessonPackage(input: $input, condition: $condition) {
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
export const createPackageBands = /* GraphQL */ `
  mutation CreatePackageBands(
    $input: CreatePackageBandsInput!
    $condition: ModelPackageBandsConditionInput
  ) {
    createPackageBands(input: $input, condition: $condition) {
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
export const updatePackageBands = /* GraphQL */ `
  mutation UpdatePackageBands(
    $input: UpdatePackageBandsInput!
    $condition: ModelPackageBandsConditionInput
  ) {
    updatePackageBands(input: $input, condition: $condition) {
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
export const deletePackageBands = /* GraphQL */ `
  mutation DeletePackageBands(
    $input: DeletePackageBandsInput!
    $condition: ModelPackageBandsConditionInput
  ) {
    deletePackageBands(input: $input, condition: $condition) {
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
