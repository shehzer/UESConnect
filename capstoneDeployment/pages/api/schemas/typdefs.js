const { gql } = require('apollo-server-micro')

module.exports = gql`
  scalar Upload
  type Query {
    club(ID: ID!): Club!
    getClubs(amount: Int): [Club]
    position(ID: ID!): Position!
    getPositions(amount: Int, clubId: String): [Position]
    application(ID: ID!): Application!
    getApplications(amount: Int, positionID: String): [Application]
    user(id: ID!): User
    getObjects(objType: String, objId: String): [Object]
    getAdminList(name: String): adminReturn

  }

  type Mutation {
    createClub(clubInput: ClubInput): Club!
    deleteClub(ID: ID!): Boolean!
    editClub(ID: ID!, clubInput: ClubInput): Boolean
    createPosition(positionInput: PositionInput): Position!
    deletePosition(ID: ID!): Boolean!
    editPosition(ID: ID!, positionInput: PositionInput): Boolean
    createApplication(file: Upload, applicationInput: ApplicationInput): Application!
    deleteApplication(ID: ID!): Boolean!
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): LoginReturn
    objectUploader(filename: Upload!, objType:String, objId: String): String!
    uploadFile(file: Upload!): Boolean
    addExec(file: Upload, clubId: String, execAdd: ExecAdd): Execs
    editExec(file: Upload, clubId: String, execInput: ExecsInput): Execs
    deleteExec(clubId: String, execId: String): Boolean!
    deleteUser(ID: ID!): Boolean!
    editUser(changeUserInput: ChangeUserInput): Boolean!
    uploadClubLogo( file: Upload, clubId: String): String
  }

  input ChangeUserInput {
    _id: String!
    password: String!
    newName: String
    newPassword: String
    newEmail: String
    
  }
  
  type Club {
    _id: String
    name: String
    department: String
    description: String
    logoURL: String
    execs: [Execs]
  }

  type LoginReturn {
    token: String
    userRole: String
    _id: String
  }

  type adminReturn {
    adminList: [User]
  }

  input RegisterInput {
    name: String
    email: String
    password: String
    role: String
    clubName: String
  }

  input LoginInput {
    email: String
    password: String
  }

  input ExecAdd {
    name: String
    role: String
    year: String
    program: String
  }

  type Exec {
    _id: String
    name: String
    role: String
    year: String
    program: String
  }

  type Execs {
    _id: String
    name: String
    role: String
    year: String
    program: String
    headshotURL: String
  }

  input ExecsInput {
    _id: String
    name: String
    role: String
    year: String
    program: String
  }

  type User {
    userID: String
    name: String
    email: String
    password: String
    role: String
    token: String
    clubName: String
    clubID: String
  }

  type Position {
    _id: String
    name: String
    description: String
    numberOfOpenings: Int
    skills: [Skill]
    q: [Question]
    clubId: String
  }

  type Application {
    _id: String
    name: String
    email: String
    description: String
    qA: [QuestionAnswer]
    positionID: String
    resumeURL: String
  }

  type QuestionAnswer {
    question: String
    answer: String
  }

  type Question {
    question: String
  }
  type Skill {
    skill: String
  }
  input QuestionInput {
    question: String
  }
  input SkillInput {
    skill: String
  }

  input ClubInput {
    name: String
    department: String
    description: String
    execs: [ExecsInput]
  }

  input PositionInput {
    name: String
    description: String
    numberOfOpenings: Int
    skills: [SkillInput]
    q: [QuestionInput]
    clubId: String
  }

  input ApplicationInput {
    name: String
    email: String
    description: String
    qA: [QuestionAnswerInput]
    positionID: String
  }

  input QuestionAnswerInput {
    question: String
    answer: String
  }

  input TheFile{
    filename: Upload!
  }

  type UploadedFileResponse {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Object{
    filename: String!
    url: String!
    objType: String!
    objId: String!
  }
`
