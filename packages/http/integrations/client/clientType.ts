import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DChrono from "@duplojs/lang/chrono";
import * as DSFile from "@duplojs/server/file";
import * as DPath from "@duplojs/lang/path";
import * as DModeling from "@duplojs/lang/modeling";
import * as DNumber from "@duplojs/lang/number";
//#region ../core/routes/types/user.d.ts
interface User {
  readonly id: number;
  readonly name: string;
  readonly age: number;
  readonly friends?: readonly User[];
  readonly createdAt?: DChrono.TheDate;
}
//#endregion
//#region ../core/routes/users.d.ts
declare const __duploRoute_2_6: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/users"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [{
    readonly beforeSendResponse: ({ currentResponse, next }: import("@duplojs/http").RouteHookParamsAfter) => import("@duplojs/http").RouteHookNext;
  }];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").HandlerStep<{
    theFunction(floor: {}, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"200", "users.findMany", readonly User[]>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_2_6 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_2_6>;
declare const __duploRoute_2_7: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/users/{userId}"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      params: {
        userId: NoInfer<DDataStructure.TypeStructure<number, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      userId: number;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"200", "users.find", User>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_2_7 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_2_7>;
declare const __duploRoute_2_8: import("@duplojs/http").Route<{
  readonly method: "POST";
  readonly paths: readonly ["/users"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: DDataStructure.Structure<User, DDataStructure.StructureDefinition<readonly DDataStructure.Constraint<unknown, User, DDataStructure.ConstraintDefinition>[]>>;
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      body: User;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"200", "users.create", User>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_2_8 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_2_8>;
declare const __duploRoute_2_9: import("@duplojs/http").Route<{
  readonly method: "DELETE";
  readonly paths: readonly ["/users"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: {
        id: NoInfer<DDataStructure.TypeStructure<number, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      id: number;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"204", "users.deleted", undefined>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_2_9 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_2_9>;
//#endregion
//#region ../core/routes/document.d.ts
declare const __duploRoute_3_9: import("@duplojs/http").Route<{
  readonly method: "POST";
  readonly paths: readonly ["/documents"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: import("@duplojs/http").BodyController<"formData", import("@duplojs/http").FormDataBodyReaderParams>;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: {
        bool: NoInfer<DDataStructure.TypeStructure<boolean, readonly []>>;
        myFile: NoInfer<DDataStructure.ArrayStructure<readonly DSFile.FileInterface<DPath.AnyPath>[], readonly [DDataStructure.ArrayLengthEqualConstraint<1>]>>;
        name: NoInfer<DDataStructure.TypeStructure<string, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      bool: boolean;
      myFile: readonly DSFile.FileInterface<DPath.AnyPath>[] & import("@duplojs/lang/array").LengthEqual<1>;
      name: string;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"204", "file.receive", undefined>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_3_9 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_3_9>;
declare const __duploRoute_3_10: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/documents/*"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").HandlerStep<{
    theFunction(floor: {}, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"200", "file.send", DSFile.FileInterface<"files/fakeFiles/superTextFile.txt" & DPath.Path>>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_3_10 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_3_10>;
//#endregion
//#region ../core/routes/serverSentEvent.d.ts
declare const __duploRoute_4_3: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/sse"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      query: {
        close: DDataStructure.UnionStructure<boolean | undefined, readonly []>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      close: boolean | undefined;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").PredictedResponse<"204", "close", undefined> | import("@duplojs/http").ServerSentEventsPredictedResponse<"200", "super-sse", {
      message: {
        test: string;
      };
    } & {
      other: string;
    }>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_4_3 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_4_3>;
//#endregion
//#region ../core/routes/cookie.d.ts
declare const __duploRoute_5_2: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/cookie-check"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      cookies: {
        session: NoInfer<DDataStructure.TypeStructure<string, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      session: string;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"200", "cookie.checked", {
      readonly session: string;
    }>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_5_2 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_5_2>;
declare const __duploRoute_5_3: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/cookie-drop"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").HandlerStep<{
    theFunction(floor: {}, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"204", "cookie.dropped", undefined>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_5_3 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_5_3>;
//#endregion
//#region ../core/routes/stream.d.ts
declare const __duploRoute_6_3: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/stream"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      query: {
        value: NoInfer<DDataStructure.TypeStructure<number, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      value: number;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").StreamPredictedResponse<"200", "monSuperStream", number>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_6_3 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_6_3>;
declare const __duploRoute_6_4: import("@duplojs/http").Route<{
  readonly method: "POST";
  readonly paths: readonly ["/stream-text"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: {
        value: NoInfer<DDataStructure.TypeStructure<string, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      value: string;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): DCommon.MaybePromise<import("@duplojs/http").StreamTextPredictedResponse<"200", "monSuperStream">>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_6_4 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_6_4>;
//#endregion
//#region ../core/routes/rejection.d.ts
declare const __duploRoute_7_2: import("@duplojs/http").Route<{
  readonly method: "POST";
  readonly paths: readonly ["/rejections/extract"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: {
        id: NoInfer<DDataStructure.TypeStructure<number, readonly []>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      id: number;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"204", "handled", undefined>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_7_2 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_7_2>;
declare const __duploRoute_7_4: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/rejections/checker"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").CheckerStep<{
    readonly checker: import("@duplojs/http").Checker<{
      theFunction(input: boolean, params: import("@duplojs/http").CheckerFunctionParams<undefined>): import("@duplojs/lang").MaybePromise<import("@duplojs/http").CheckerFunctionOutput<"allowed", undefined> | import("@duplojs/http").CheckerFunctionOutput<"denied", string>>;
      options: undefined;
    }>;
    readonly result: "allowed";
    readonly indexing: undefined;
    input(floor: {}): boolean;
    readonly options: undefined;
    otherwise(params: import("@duplojs/http").CheckerStepOtherwiseParams<{}, import("@duplojs/http").CheckerFunctionOutput<"denied", string>>): import("@duplojs/http").PredictedResponse<"403", "checker-rejected", {
      readonly reason: string;
    }>;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").CutStep<{
    theFunction(floor: {}, param: import("@duplojs/http").CutStepFunctionParams): Promise<never>;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {}, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"204", "handled", undefined>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_7_4 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_7_4>;
declare const __duploRoute_7_7: import("@duplojs/http").Route<{
  readonly method: "GET";
  readonly paths: readonly ["/rejections/process"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ProcessStep<{
    readonly process: import("@duplojs/http").Process<{
      readonly options: undefined;
      readonly hooks: readonly [];
      readonly metadata: readonly [];
      readonly steps: readonly [import("@duplojs/http").ProcessStep<{
        readonly process: import("@duplojs/http").Process<{
          readonly options: undefined;
          readonly hooks: readonly [];
          readonly metadata: readonly [];
          readonly steps: readonly [import("@duplojs/http").CutStep<{
            theFunction(floor: {}, param: import("@duplojs/http").CutStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"409", "process-rejected", {
              readonly reason: "nested";
            }>>;
            readonly metadata: readonly [];
          }>];
        }>;
        readonly options: undefined;
        readonly imports: undefined;
        readonly metadata: readonly [];
      }>, import("@duplojs/http").CutStep<{
        theFunction(floor: {}, param: import("@duplojs/http").CutStepFunctionParams): Promise<never>;
        readonly metadata: readonly [];
      }>];
    }>;
    readonly options: undefined;
    readonly imports: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").CutStep<{
    theFunction(floor: {}, param: import("@duplojs/http").CutStepFunctionParams): Promise<never>;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {}, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"204", "handled", undefined>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_7_7 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_7_7>;
//#endregion
//#region ../core/routes/entityFixture.d.ts
declare namespace EntityFixture {
  const Id: DModeling.NewTypeStructure<"EntityFixtureId", string, readonly [DDataStructure.UuidConstraint]>;
  type Id = DDataStructure.StructureValue<typeof Id>;
  const Name: DModeling.NewTypeStructure<"EntityFixtureName", string, readonly [DDataStructure.MinCharactersConstraint<3>, DDataStructure.MaxCharactersConstraint<80>]>;
  type Name = DDataStructure.StructureValue<typeof Name>;
  const Priority: DModeling.NewTypeStructure<"EntityFixturePriority", number, readonly [DDataStructure.GreaterThanOrEqualConstraint<1>, DDataStructure.LessThanOrEqualConstraint<10>]>;
  type Priority = DDataStructure.StructureValue<typeof Priority>;
  const CreatedAt: DModeling.NewTypeStructure<"EntityFixtureCreatedAt", import("@duplojs/lang/chrono").TheDate, readonly []>;
  type CreatedAt = DDataStructure.StructureValue<typeof CreatedAt>;
  const Duration: DModeling.NewTypeStructure<"EntityFixtureDuration", import("@duplojs/lang/chrono").TheTime, readonly []>;
  type Duration = DDataStructure.StructureValue<typeof Duration>;
  interface Node extends DModeling.ObjectTag<"EntityFixtureNode"> {
    readonly label: string;
    readonly children: readonly Node[];
  }
  const Node: DModeling.TaggedObjectStructure<Node>;
  const Entity: DModeling.EntityStructure<"EntityFixture", {
    readonly id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
    readonly name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
    readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
    readonly createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
    readonly duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
    readonly tree: Node;
  }>;
  type Entity = DDataStructure.StructureValue<typeof Entity>;
  const HighPriorityFlag: DModeling.FlagHandler<"HighPriority", DModeling.Entity<"EntityFixture"> & {
    readonly id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
    readonly name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
    readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
    readonly createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
    readonly duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
    readonly tree: Node;
  }, number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>>;
  type HighPriorityFlag = DModeling.GetFlag<typeof HighPriorityFlag>;
}
interface NodeInput {
  readonly label: string;
  readonly children: readonly NodeInput[];
}
declare const NodeInput: DDataStructure.Structure<NodeInput>;
declare const __duploRoute_8_9: import("@duplojs/http").Route<{
  readonly method: "POST";
  readonly paths: readonly ["/entity-fixture/new"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: {
        id: DModeling.NewTypeStructure<"EntityFixtureId", string, readonly [DDataStructure.UuidConstraint]>;
        name: DModeling.NewTypeStructure<"EntityFixtureName", string, readonly [DDataStructure.MinCharactersConstraint<3>, DDataStructure.MaxCharactersConstraint<80>]>;
        priority: DModeling.NewTypeStructure<"EntityFixturePriority", number, readonly [DDataStructure.GreaterThanOrEqualConstraint<1>, DDataStructure.LessThanOrEqualConstraint<10>]>;
        createdAt: DModeling.NewTypeStructure<"EntityFixtureCreatedAt", import("@duplojs/lang/chrono").TheDate, readonly []>;
        duration: DModeling.NewTypeStructure<"EntityFixtureDuration", import("@duplojs/lang/chrono").TheTime, readonly []>;
        tree: DModeling.TaggedObjectStructure<EntityFixture.Node>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
      duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
      id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
      name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
      priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
      tree: EntityFixture.Node;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"200", "entity-fixture.created", DModeling.Entity<"EntityFixture"> & {
      readonly id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
      readonly name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
      readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
      readonly createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
      readonly duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
      readonly tree: EntityFixture.Node;
    }> | import("@duplojs/http").PredictedResponse<"201", "entity-fixture.high-priority", DModeling.Entity<"EntityFixture"> & {
      readonly id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
      readonly name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
      readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
      readonly createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
      readonly duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
      readonly tree: EntityFixture.Node;
    } & DModeling.Flag<"HighPriority", number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>> & DNumber.GreaterThanOrEqual<6>>>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_8_9 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_8_9>;
declare const __duploRoute_8_10: import("@duplojs/http").Route<{
  readonly method: "POST";
  readonly paths: readonly ["/entity-fixture/map"];
  readonly preflightSteps: readonly [];
  readonly hooks: readonly [];
  readonly metadata: readonly [];
  readonly bodyController: null;
  readonly steps: readonly [import("@duplojs/http").ExtractStep<{
    readonly shape: {
      body: {
        id: NoInfer<DDataStructure.TypeStructure<string, readonly []>>;
        name: NoInfer<DDataStructure.TypeStructure<string, readonly []>>;
        priority: NoInfer<DDataStructure.TypeStructure<number, readonly []>>;
        createdAt: NoInfer<DDataStructure.TypeStructure<import("@duplojs/lang/chrono").TheDate, readonly []>>;
        duration: NoInfer<DDataStructure.TypeStructure<import("@duplojs/lang/chrono").TheTime, readonly []>>;
        tree: DDataStructure.Structure<NodeInput, DDataStructure.StructureDefinition<readonly DDataStructure.Constraint<unknown, NodeInput, DDataStructure.ConstraintDefinition>[]>>;
      };
    };
    readonly otherwise: undefined;
    readonly metadata: readonly [];
  }>, import("@duplojs/http").HandlerStep<{
    theFunction(floor: {
      createdAt: import("@duplojs/lang/chrono").TheDate;
      duration: import("@duplojs/lang/chrono").TheTime;
      id: string;
      name: string;
      priority: number;
      tree: NodeInput;
    }, params: import("@duplojs/http").HandlerStepFunctionParams): import("@duplojs/lang").MaybePromise<import("@duplojs/http").PredictedResponse<"200", "entity-fixture.created", DModeling.Entity<"EntityFixture"> & {
      readonly id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
      readonly name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
      readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
      readonly createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
      readonly duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
      readonly tree: EntityFixture.Node;
    }> | import("@duplojs/http").PredictedResponse<"201", "entity-fixture.high-priority", DModeling.Entity<"EntityFixture"> & {
      readonly id: string & DModeling.NewType<"EntityFixtureId", import("@duplojs/lang/string").Uuid>;
      readonly name: string & DModeling.NewType<"EntityFixtureName", import("@duplojs/lang/string").MaxCharacters<80> | import("@duplojs/lang/string").MinCharacters<3>>;
      readonly priority: number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>>;
      readonly createdAt: import("@duplojs/lang/chrono").TheDate & DModeling.NewType<"EntityFixtureCreatedAt", never>;
      readonly duration: import("@duplojs/lang/chrono").TheTime & DModeling.NewType<"EntityFixtureDuration", never>;
      readonly tree: EntityFixture.Node;
    } & DModeling.Flag<"HighPriority", number & DModeling.NewType<"EntityFixturePriority", DNumber.GreaterThanOrEqual<1> | DNumber.LessThanOrEqual<10>> & DNumber.GreaterThanOrEqual<6>>> | import("@duplojs/http").PredictedResponse<"422", "entity-fixture.mapping-failed", {
      readonly reason: "async-error" | "map-error";
    }>>;
    readonly metadata: readonly [];
  }>];
}>;
type __duploRoute_8_10 = import("@duplojs/http").RouteDeclarationToContract<typeof __duploRoute_8_10>;
//#endregion
//#region ../core/routes.d.ts
export type Routes = __duploRoute_2_6 | __duploRoute_2_7 | __duploRoute_2_8 | __duploRoute_2_9 | __duploRoute_3_9 | __duploRoute_3_10 | __duploRoute_4_3 | __duploRoute_5_2 | __duploRoute_5_3 | __duploRoute_6_3 | __duploRoute_6_4 | __duploRoute_7_2 | __duploRoute_7_4 | __duploRoute_7_7 | __duploRoute_8_9 | __duploRoute_8_10;
//#endregion
export {};