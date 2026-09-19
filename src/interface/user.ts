interface User {
  userId: string
  name: string
  username: string
  role: Role
  email: string
  pfImg: string
  password: string
}

interface Role {
  roleName: RoleName.CLIENT
  roleId: Int16Array
}

const enum RoleName {
  CLIENT = "CLIENT",
  FREELANCER = "FREELANCER",
  ADMIN = "ADMIN",
}
