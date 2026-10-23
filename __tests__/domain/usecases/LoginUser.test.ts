import { Auth } from "@/domain/entities/Auth";
import { User } from "@/domain/entities/User";
import { ISessionRepository } from "@/domain/repositories/ISessionRepository";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { LoginResult, LoginUser } from "@/domain/usecases/LoginUser";
import { MockProxy, mock } from "jest-mock-extended";

describe("Login Use Case", () => {
  let mockUserRepo: MockProxy<IUserRepository>;
  let mockAuthSessionRepo: MockProxy<ISessionRepository>;
  let loginUser: LoginUser;

  const validPayload = {
    name: "Agus Budi",
    password: "secret123",
    username: "agusbudi",
  };

  const dummyUser: User = {
    userId: "user1234",
    name: validPayload.name,
    username: validPayload.username,
  };

  const dummyAuthSession: Auth = {
    token: "abcdefghijklmnopqrstuvwxyz",
    user: dummyUser,
  };

  const loginResult: LoginResult = {
    status: "signed_in",
    user: dummyUser,
  };

  beforeEach(() => {
    mockUserRepo = mock<IUserRepository>();
    mockAuthSessionRepo = mock<ISessionRepository>();
    loginUser = new LoginUser(mockUserRepo, mockAuthSessionRepo);
  });

  // Aturan Bisnis 1 & Hasil: Sistem mengirim username dan password ke server
  it("harus mengembalikan data User jika pendaftaran berhasil", async () => {
    mockUserRepo.login.mockResolvedValue(dummyAuthSession);

    const result = await loginUser.execute(
      validPayload.username,
      validPayload.password,
    );

    expect(mockUserRepo.login).toHaveBeenCalledWith(
      validPayload.username,
      validPayload.password,
    );
    expect(result).toEqual(loginResult);
  });

  // Aturan Bisnis 2 & Hasil: Token disimpan di penyimpanan aman; data pengguna di penyimpanan lokal. Password tidak pernah disimpan.
  //   it("harus mengembalikan null jika username sudah terpakai (CONFLICT)", async () => {
  //     const conflictError = new RegisterError(
  //       "CONFLICT",
  //       "This username already used",
  //     );
  //     mockUserRepo.register.mockRejectedValue(conflictError);

  //     const result = await registerUser.execute(validPayload);

  //     expect(mockUserRepo.register).toHaveBeenCalledWith(validPayload);
  //     expect(result).toBeNull();
  //   });

  //   // Aturan Bisnis 4 & Hasil: Gagal (Koneksi / Server error selain CONFLICT)
  //   it("harus melempar error kembali jika pendaftaran gagal akibat masalah server atau koneksi", async () => {
  //     const genericError = new RegisterError("REGISTER_FAILED", "");
  //     mockUserRepo.register.mockRejectedValue(genericError);

  //     await expect(registerUser.execute(validPayload)).rejects.toThrow(
  //       genericError,
  //     );

  //     expect(mockUserRepo.register).toHaveBeenCalledWith(validPayload);
  //   });
});
