import { User } from "@/domain/entities/User";
import { RegisterError } from "@/domain/errors/RegisterErrorCode";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { RegisterUser } from "@/domain/usecases/RegisterUser";
import { mock, MockProxy } from "jest-mock-extended";

describe("RegisterUser Use Case", () => {
  let mockUserRepo: MockProxy<IUserRepository>;
  let registerUser: RegisterUser;

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
    registerUser = new RegisterUser(mockUserRepo);
  });

  // Aturan Bisnis 1 & Hasil: Terdaftar dan login
  it("harus mengembalikan data User jika pendaftaran berhasil", async () => {
    mockUserRepo.register.mockResolvedValue(dummyUser);

    const result = await registerUser.execute(
      validPayload.name,
      validPayload.password,
      validPayload.username,
    );

    expect(mockUserRepo.register).toHaveBeenCalledWith(
      validPayload.name,
      validPayload.username,
      validPayload.password,
    );
    expect(result).toEqual(dummyUser);
  });

  // Aturan Bisnis 3 & Hasil: Username sudah dipakai (CONFLICT)
  it("harus mengembalikan null jika username sudah terpakai (CONFLICT)", async () => {
    const conflictError = new RegisterError(
      "CONFLICT",
      "This username already used",
    );
    mockUserRepo.register.mockRejectedValue(conflictError);

    const result = await registerUser.execute(
      validPayload.name,
      validPayload.password,
      validPayload.username,
    );

    expect(mockUserRepo.register).toHaveBeenCalledWith(
      validPayload.name,
      validPayload.username,
      validPayload.password,
    );
    expect(result).toBeNull();
  });

  // Aturan Bisnis 4 & Hasil: Gagal (Koneksi / Server error selain CONFLICT)
  it("harus melempar error kembali jika pendaftaran gagal akibat masalah server atau koneksi", async () => {
    const genericError = new RegisterError("REGISTER_FAILED", "");
    mockUserRepo.register.mockRejectedValue(genericError);

    await expect(
      registerUser.execute(
        validPayload.name,
        validPayload.password,
        validPayload.username,
      ),
    ).rejects.toThrow(genericError);

    expect(mockUserRepo.register).toHaveBeenCalledWith(
      validPayload.name,
      validPayload.username,
      validPayload.password,
    );
  });
});
