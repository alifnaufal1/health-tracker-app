import { User } from "@/domain/entities/User";
import { RegisterError } from "@/domain/errors/RegisterErrorCode";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { LoginUser } from "@/domain/usecases/LoginUser";
import { RegisterUser } from "@/domain/usecases/RegisterUser";
import { mock, MockProxy } from "jest-mock-extended";

describe("RegisterUser Use Case", () => {
  let mockUserRepo: MockProxy<IUserRepository>;
  let registerUser: RegisterUser;
  let mockLoginUser: MockProxy<LoginUser>;

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

  beforeEach(() => {
    mockUserRepo = mock<IUserRepository>();
    mockLoginUser = mock<LoginUser>();
    registerUser = new RegisterUser(mockUserRepo, mockLoginUser);
  });

  // Aturan Bisnis 1 & Hasil: Terdaftar dan login
  it("harus mengembalikan data User jika pendaftaran berhasil", async () => {
    mockUserRepo.register.mockResolvedValue(dummyUser);

    const result = await registerUser.execute(validPayload);

    expect(mockUserRepo.register).toHaveBeenCalledWith(validPayload);
    expect(result).toEqual(dummyUser);
  });

  // Aturan Bisnis 3 & Hasil: Username sudah dipakai (CONFLICT)
  it("harus mengembalikan null jika username sudah terpakai (CONFLICT)", async () => {
    const conflictError = new RegisterError(
      "CONFLICT",
      "This username already used",
    );
    mockUserRepo.register.mockRejectedValue(conflictError);

    const result = await registerUser.execute(validPayload);

    expect(mockUserRepo.register).toHaveBeenCalledWith(validPayload);
    expect(result).toBeNull();
  });

  // Aturan Bisnis 4 & Hasil: Gagal (Koneksi / Server error selain CONFLICT)
  it("harus melempar error kembali jika pendaftaran gagal akibat masalah server atau koneksi", async () => {
    const genericError = new RegisterError("REGISTER_FAILED", "");
    mockUserRepo.register.mockRejectedValue(genericError);

    await expect(registerUser.execute(validPayload)).rejects.toThrow(
      genericError,
    );

    expect(mockUserRepo.register).toHaveBeenCalledWith(validPayload);
  });
});
