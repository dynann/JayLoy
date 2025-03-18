const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error('no token was found')
  }
  const tokenPayload = JSON.parse(atob(token.split(".")[1]))
  const id = tokenPayload.sub // 'sub' is typically where the user ID is stored
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}

// Specific API functions
export const api = {
  getMyProfile: (id: number) => {
    const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error('no token was found')
  }
  const tokenPayload = JSON.parse(atob(token.split(".")[1]))
    request<User>(`/users/${id}`)
    },
  createUser: (userData: Partial<User>) =>
    request<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  updateUser: (id: string, userData: Partial<User>) =>
    request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  deleteUser: (id: string) =>
    request<void>(`/users/${id}`, {
      method: "DELETE",
    }),
};

export enum GENDER {
  male = "MALE",
  female = "FEMALE",
  unspecify = "UNSPECIFY",
}
export enum ROLE {
  admin = "ADMIN",
  user = "USER",
  systemAdmin = "SYSTEM_ADMIN",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  profileURL: string;
  gender: GENDER;
  role: ROLE;
  createdAt: string;
}
