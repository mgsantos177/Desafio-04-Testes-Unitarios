import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe('Get Balance', () => {

  let userRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let statementRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(userRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementRepository, userRepository);
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository);
  });

  it('should be able to get the user balance', async () => {
    const user = await createUserUseCase.execute({
      name: "name test",
      email: "test@gmail.com",
      password: "test"
    });

    await createStatementUseCase.execute({
      amount: 200,
      description: "deposit",
      type: "deposit" as OperationType,
      user_id: user.id
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });
    expect(balance).toHaveProperty("balance");

  });


  it('should be not able to get the balance of an inexistent user', async () => {



    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "44234" });
    }).rejects.toBeInstanceOf(AppError);

  });
});
