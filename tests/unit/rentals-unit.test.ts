import rentalsService from "../../src/services/rentals-service";
import rentalsRepository from "../../src/repositories/rentals-repository";
import usersRepository from "repositories/users-repository";
import moviesRepository from "repositories/movies-repository";

describe("Rentals Service Unit Tests", () => {
	beforeEach(() => {
	  jest.clearAllMocks();
	});

	it("should return rentals", async () => {
	  jest.spyOn(rentalsRepository, "getRentals").mockResolvedValueOnce([
	    { id: 1, closed: false, date: new Date(), endDate: new Date(), userId: 1 },
	    { id: 2, closed: false, date: new Date(), endDate: new Date(), userId: 1 }
	  ]);
	
	  const rentals = await rentalsService.getRentals();
	  expect(rentals).toHaveLength(2);
	});

  it("should create a rental", async () => {
	  jest.spyOn(usersRepository, "getById").mockImplementationOnce(() : any => {
        return {
          id: 1,
          firstName: "cleiver",
          lastName: "coelho",
          email: "cleiver@coelho.com",
          cpf: "11122234567",
          birthDate: "1999-01-29"
      }
    });

    // checar se nao tem aluguel pendente
    jest.spyOn(rentalsRepository, "getRentalsByUserId").mockImplementationOnce(() : any => {
      return []
    });
    
    // checar se o filme desejado está alugado
    jest.spyOn(moviesRepository, "getById").mockImplementationOnce(() : any => {
      return {
        id: 1,
        name: "Filme1",
        adultsOnly: false,
        rentalId: null
    }
    });

    const date = new Date();
    jest.spyOn(rentalsRepository, "createRental").mockImplementationOnce(() : any => {
      return {
        userId : 1,
        endDate : date
      }
    });
	
	  const rental = await rentalsService.createRental({userId: 1, moviesId: [1]});
    expect(rentalsRepository.createRental).toBeCalledTimes(1);
	  expect(rental).toEqual({
      userId : 1,
      endDate : date
    });
	});

  it("should return a rental => includeMovies: false", async () => {
	  const date = new Date();
    jest.spyOn(rentalsRepository, "getRentalById").mockImplementationOnce(() : any => {
        return {
          id : 1,
          date : date,
          endDate: date,
          userId: 1,
          closed : true
      }
    });

	  const rental = await rentalsService.getRentalById(1);
    expect(rentalsRepository.getRentalById).toBeCalledTimes(1);
	  expect(rental).toEqual({
      id : 1,
      date : date,
      endDate: date,
      userId: 1,
      closed : true
    });
  });

  it("should return with rentals => includeMovies: false", async () => {
	  const date = new Date();
    jest.spyOn(rentalsRepository, "getRentals").mockImplementationOnce(() : any => {
        return [{
          id : 1,
          date : date,
          endDate: date,
          userId: 1,
          closed : true
      }, {
        id : 2,
        date : date,
        endDate: date,
        userId: 1,
        closed : true
    }]
    });

	  const rental = await rentalsService.getRentals();
    expect(rentalsRepository.getRentals).toBeCalledTimes(1);
	  expect(rental).toEqual([{
          id : 1,
          date : date,
          endDate: date,
          userId: 1,
          closed : true
      }, {
        id : 2,
        date : date,
        endDate: date,
        userId: 1,
        closed : true
    }]);
  });

  it("should finish a rental", async () => {
	  const date = new Date();
    jest.spyOn(rentalsRepository, "getRentalById").mockImplementationOnce(() : any => {
        return {
          id : 1,
          date : date,
          endDate: date,
          userId: 1,
          closed : false
      }
    });
    jest.spyOn(rentalsRepository, "finishRental").mockImplementationOnce(() : any => {
        return {
          id : 1,
          date : date,
          endDate: date,
          userId: 1,
          closed : true
      }
    });

	  const rental = await rentalsService.finishRental(1);
    expect(rentalsRepository.getRentalById).toBeCalledTimes(1);
    expect(rentalsRepository.finishRental).toBeCalledTimes(1);
	  expect(rental).toEqual(undefined);
  });


})


describe("Tests", () => {
  it("should work", () => {
    expect(true).toBe(true);
  })
})