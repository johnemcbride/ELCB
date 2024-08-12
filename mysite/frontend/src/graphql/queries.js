/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getIncomingWebHookEvents = /* GraphQL */ `
  query GetIncomingWebHookEvents($id: ID!) {
    getIncomingWebHookEvents(id: $id) {
      id
      application
      message
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listIncomingWebHookEvents = /* GraphQL */ `
  query ListIncomingWebHookEvents(
    $filter: ModelIncomingWebHookEventsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIncomingWebHookEvents(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        application
        message
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const incomingWebHookEventsByApplication = /* GraphQL */ `
  query IncomingWebHookEventsByApplication(
    $application: String!
    $sortDirection: ModelSortDirection
    $filter: ModelIncomingWebHookEventsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    incomingWebHookEventsByApplication(
      application: $application
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        application
        message
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getApplicationEventLog = /* GraphQL */ `
  query GetApplicationEventLog($id: ID!) {
    getApplicationEventLog(id: $id) {
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
export const listApplicationEventLogs = /* GraphQL */ `
  query ListApplicationEventLogs(
    $filter: ModelApplicationEventLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationEventLogs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const applicationEventLogsByDateStringAndCreatedAt = /* GraphQL */ `
  query ApplicationEventLogsByDateStringAndCreatedAt(
    $dateString: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationEventLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationEventLogsByDateStringAndCreatedAt(
      dateString: $dateString
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const applicationEventLogsByName = /* GraphQL */ `
  query ApplicationEventLogsByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationEventLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationEventLogsByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const applicationEventLogsByStatus = /* GraphQL */ `
  query ApplicationEventLogsByStatus(
    $status: String!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationEventLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    applicationEventLogsByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getMember = /* GraphQL */ `
  query GetMember($id: ID!) {
    getMember(id: $id) {
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
export const listMembers = /* GraphQL */ `
  query ListMembers(
    $filter: ModelMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const membersByUsername = /* GraphQL */ `
  query MembersByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    membersByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getEnrolment = /* GraphQL */ `
  query GetEnrolment($id: ID!) {
    getEnrolment(id: $id) {
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
export const listEnrolments = /* GraphQL */ `
  query ListEnrolments(
    $filter: ModelEnrolmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEnrolments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        bands
        status
        rate
        term
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
        owners
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const enrolmentsByTermAndCreatedAt = /* GraphQL */ `
  query EnrolmentsByTermAndCreatedAt(
    $term: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEnrolmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    enrolmentsByTermAndCreatedAt(
      term: $term
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        bands
        status
        rate
        term
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
        owners
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const enrolmentsByMemberEnrolmentsIdAndTerm = /* GraphQL */ `
  query EnrolmentsByMemberEnrolmentsIdAndTerm(
    $memberEnrolmentsId: ID!
    $term: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEnrolmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    enrolmentsByMemberEnrolmentsIdAndTerm(
      memberEnrolmentsId: $memberEnrolmentsId
      term: $term
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        bands
        status
        rate
        term
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
        owners
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTerm = /* GraphQL */ `
  query GetTerm($id: ID!) {
    getTerm(id: $id) {
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
export const listTerms = /* GraphQL */ `
  query ListTerms(
    $filter: ModelTermFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTerms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        startDate
        endDate
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBandPackage = /* GraphQL */ `
  query GetBandPackage($id: ID!) {
    getBandPackage(id: $id) {
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
export const listBandPackages = /* GraphQL */ `
  query ListBandPackages(
    $filter: ModelBandPackageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBandPackages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        createdAt
        updatedAt
        termBandpackagesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBand = /* GraphQL */ `
  query GetBand($id: ID!) {
    getBand(id: $id) {
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
export const listBands = /* GraphQL */ `
  query ListBands(
    $filter: ModelBandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBands(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        active
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLessonPackage = /* GraphQL */ `
  query GetLessonPackage($id: ID!) {
    getLessonPackage(id: $id) {
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
export const listLessonPackages = /* GraphQL */ `
  query ListLessonPackages(
    $filter: ModelLessonPackageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLessonPackages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        createdAt
        updatedAt
        termLessonpackageId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPackageBands = /* GraphQL */ `
  query GetPackageBands($id: ID!) {
    getPackageBands(id: $id) {
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
export const listPackageBands = /* GraphQL */ `
  query ListPackageBands(
    $filter: ModelPackageBandsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPackageBands(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        bandPackageId
        bandId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const packageBandsByBandPackageId = /* GraphQL */ `
  query PackageBandsByBandPackageId(
    $bandPackageId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPackageBandsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    packageBandsByBandPackageId(
      bandPackageId: $bandPackageId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        bandPackageId
        bandId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const packageBandsByBandId = /* GraphQL */ `
  query PackageBandsByBandId(
    $bandId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPackageBandsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    packageBandsByBandId(
      bandId: $bandId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        bandPackageId
        bandId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
