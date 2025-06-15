# Clean Architecture for React CRM Applications

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Layer Definitions](#layer-definitions)
4. [Folder Structure](#folder-structure)
5. [Core Principles](#core-principles)
6. [Layer Interactions](#layer-interactions)
7. [Implementation Examples](#implementation-examples)
8. [Benefits & Trade-offs](#benefits--trade-offs)
9. [Best Practices](#best-practices)
10. [Testing Strategy](#testing-strategy)

## Introduction

Clean Architecture is a software design philosophy that creates systems with clear separation of concerns, making applications more maintainable, scalable, and testable. For React CRM applications, this approach organizes code into distinct layers where business logic remains independent of UI frameworks, databases, and external services.

### Why Clean Architecture for CRM?

CRM applications typically have:

- Complex business rules (customer lifecycle, sales processes, permissions)
- Multiple data sources (APIs, local storage, third-party integrations)
- Evolving UI requirements
- Need for extensive testing
- Multiple team members working simultaneously

Clean Architecture addresses these challenges by creating clear boundaries and dependencies that flow inward toward business logic.

## Architecture Overview

The architecture consists of five main layers, each with specific responsibilities:

```
┌─────────────────────────────────────────┐
│              Presentation               │  ← Routes, Pages, Layouts
├─────────────────────────────────────────┤
│               Features                  │  ← Business Modules
│  ┌─────────────────────────────────────┐│
│  │ Presentation → Application → Domain ││  ← Per Feature
│  │        ↓            ↓         ↓    ││
│  │    Infrastructure   │         │    ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│                Shared                   │  ← Reusable Components
├─────────────────────────────────────────┤
│            Infrastructure               │  ← Technical Services
├─────────────────────────────────────────┤
│                 Core                    │  ← Business Entities
└─────────────────────────────────────────┘
```

**Dependency Flow**: Outer layers depend on inner layers, never the reverse.

## Layer Definitions

### 1. Core Layer (Innermost)

**Purpose**: Contains the most fundamental business rules and entities that are unlikely to change.

**Contents**:

- **Entities**: Core business objects (Customer, User, Order)
- **Types**: Shared TypeScript interfaces and types
- **Utilities**: Pure functions with no side effects
- **Constants**: Application-wide constants

**Characteristics**:

- No dependencies on other layers
- Pure TypeScript/JavaScript
- No React, no external libraries
- Contains the "heart" of business logic

**Example Structure**:

```
core/
├── entities/
│   ├── customer.ts
│   ├── user.ts
│   └── order.ts
├── types/
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   └── calculations.ts
└── constants/
    ├── status.ts
    └── config.ts
```

### 2. Shared Layer

**Purpose**: Provides reusable components, hooks, and services used across multiple features.

**Contents**:

- **Components**: UI building blocks (Button, Modal, Form elements)
- **Hooks**: Cross-cutting React hooks (useAuth, useTheme, useApi)
- **Providers**: React Context providers for global state
- **Styles**: Global CSS, themes, design tokens

**Characteristics**:

- Can depend on Core layer
- Contains React-specific code
- Promotes consistency across features
- Should be feature-agnostic

**Example Structure**:

```
shared/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── modal.tsx
│   │   └── table.tsx
│   └── layout/
│       ├── header.tsx
│       └── sidebar.tsx
├── hooks/
│   ├── use-auth.ts
│   ├── use-api.ts
│   └── use-local-storage.ts
├── providers/
│   ├── auth-provider.tsx
│   ├── theme-provider.tsx
│   └── toast-provider.tsx
└── styles/
    ├── globals.css
    └── theme.ts
```

### 3. Features Layer

**Purpose**: Contains self-contained business modules, each representing a distinct domain area.

**Structure per Feature**:

```
features/customers/
├── domain/                 # Business rules specific to customers
│   ├── entities/
│   ├── repositories/       # Interfaces only
│   └── services/          # Domain services
├── application/           # Use cases and application logic
│   ├── use-cases/
│   └── services/
├── infrastructure/        # External concerns implementation
│   ├── api/
│   ├── storage/
│   └── mappers/
└── presentation/          # UI components and hooks
    ├── components/
    ├── hooks/
    └── pages/
```

**Characteristics**:

- Self-contained and independently deployable
- Can depend on Core and Shared layers
- Internal dependency flow: Presentation → Application → Domain
- Infrastructure implements Domain interfaces

### 4. Infrastructure Layer

**Purpose**: Handles technical concerns that support the entire application.

**Contents**:

- **API Clients**: HTTP clients with retry, caching, error handling
- **Authentication**: Token management, session control
- **State Management**: Global store setup (Redux, Zustand)
- **Logging**: Error tracking, analytics
- **Storage**: Browser storage abstractions

**Characteristics**:

- Can depend on Core layer
- Implements interfaces defined in other layers
- Contains framework-specific code
- Handles external system integration

### 5. Presentation Layer (Outermost)

**Purpose**: Orchestrates the overall application structure and navigation.

**Contents**:

- **Pages**: Route-based page components
- **Layouts**: App-wide wrappers and navigation
- **Routing**: React Router setup and route definitions
- **App**: Main application component

**Characteristics**:

- Can depend on all other layers
- Composes features into complete user flows
- Handles high-level navigation and layout

## Folder Structure

```
src/
├── core/                           # Pure business logic
│   ├── entities/
│   │   ├── customer.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── common.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── format-date.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   └── constants/
│       ├── status.ts
│       └── index.ts
│
├── shared/                         # Reusable across features
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── index.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-api.ts
│   │   ├── use-local-storage.ts
│   │   └── index.ts
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── index.ts
│   └── styles/
│       ├── globals.css
│       └── theme.ts
│
├── features/                       # Business modules
│   ├── customers/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── customer.ts
│   │   │   ├── repositories/
│   │   │   │   └── customer-repository.ts
│   │   │   └── services/
│   │   │       └── customer-domain-service.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-customer.ts
│   │   │   │   ├── update-customer.ts
│   │   │   │   └── delete-customer.ts
│   │   │   └── services/
│   │   │       └── customer-application-service.ts
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   │   └── customer-api-client.ts
│   │   │   ├── storage/
│   │   │   │   └── customer-local-storage.ts
│   │   │   └── mappers/
│   │   │       └── customer-mapper.ts
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── customer-list.tsx
│   │       │   ├── customer-form.tsx
│   │       │   └── customer-detail.tsx
│   │       ├── hooks/
│   │       │   ├── use-customers.ts
│   │       │   └── use-customer-form.ts
│   │       └── pages/
│   │           ├── customers-list-page.tsx
│   │           └── customer-detail-page.tsx
│   │
│   ├── users/                      # Similar structure
│   ├── analytics/                  # Similar structure
│   └── permissions/                # Similar structure
│
├── infrastructure/                 # App-wide technical services
│   ├── api/
│   │   ├── http-client.ts
│   │   ├── api-error.ts
│   │   └── interceptors/
│   ├── auth/
│   │   ├── token-manager.ts
│   │   ├── auth-service.ts
│   │   └── auth-guard.tsx
│   ├── storage/
│   │   ├── local-storage-adapter.ts
│   │   └── session-storage-adapter.ts
│   ├── logging/
│   │   ├── logger.ts
│   │   └── error-reporter.ts
│   └── state/
│       ├── store.ts
│       └── middleware/
│
├── presentation/                   # App-level UI structure
│   ├── pages/
│   │   ├── home-page.tsx
│   │   ├── login-page.tsx
│   │   └── not-found-page.tsx
│   ├── layouts/
│   │   ├── main-layout.tsx
│   │   ├── auth-layout.tsx
│   │   └── empty-layout.tsx
│   ├── routes/
│   │   ├── app-router.tsx
│   │   ├── protected-route.tsx
│   │   └── routes.ts
│   └── components/
│       ├── navigation.tsx
│       └── breadcrumbs.tsx
│
├── app.tsx                         # Main app component
├── main.tsx                        # Entry point
└── vite-env.d.ts                  # Type definitions
```

## Core Principles

### 1. Dependency Rule

**The most important rule**: Dependencies must point inward only.

```typescript
// ✅ Correct: Outer layer depends on inner layer
// presentation/hooks/use-customers.ts
import { Customer } from "../../../core/entities/customer";
import { CustomerService } from "../../../features/customers/application/services/customer-service";

// ❌ Wrong: Inner layer depends on outer layer
// core/entities/customer.ts
import { CustomerComponent } from "../../../presentation/components/customer-component"; // Never!
```

**Why this matters**:

- Business logic remains stable when UI changes
- Core entities don't break when switching frameworks
- Testing becomes easier with clear dependencies

### 2. Separation of Concerns

Each layer has a single, well-defined responsibility:

- **Core**: "What is a Customer?" (entities, business rules)
- **Application**: "What can we do with Customers?" (use cases)
- **Infrastructure**: "How do we get Customers?" (API, database)
- **Presentation**: "How do we show Customers?" (UI components)

### 3. Abstraction Through Interfaces

Use interfaces to define contracts between layers:

```typescript
// Domain layer defines the contract
export interface CustomerRepository {
  findById(id: string): Promise<Customer>;
  save(customer: Customer): Promise<void>;
}

// Infrastructure layer implements the contract
export class CustomerApiClient implements CustomerRepository {
  async findById(id: string): Promise<Customer> {
    // API implementation
  }

  async save(customer: Customer): Promise<void> {
    // API implementation
  }
}
```

### 4. Modularity

Features should be:

- **Independent**: Can be developed in parallel
- **Cohesive**: Related functionality grouped together
- **Loosely Coupled**: Minimal dependencies between features

## Layer Interactions

### Data Flow Example: Loading Customer List

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  CustomerList   │───▶│  useCustomers    │───▶│ CustomerService │
│   Component     │    │     Hook         │    │  (Application)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                       │
         │                        │                       ▼
         │                        │              ┌─────────────────┐
         │                        │              │CustomerRepository│
         │                        │              │   (Interface)   │
         │                        │              └─────────────────┘
         │                        │                       ▲
         │                        │                       │
         │                        │              ┌─────────────────┐
         │                        └──────────────│ CustomerApiClient│
         │                                       │(Infrastructure) │
         └───────────────────────────────────────└─────────────────┘
```

**Step-by-step flow**:

1. `CustomerList` component needs data, calls `useCustomers` hook
2. `useCustomers` hook calls `CustomerService.getAllCustomers()`
3. `CustomerService` calls `CustomerRepository.findAll()`
4. `CustomerApiClient` (implements `CustomerRepository`) makes HTTP request
5. Data flows back through the same path to the component

### Dependency Injection Pattern

```typescript
// Setup dependencies (usually in app.tsx or a composition root)
const httpClient = new HttpClient();
const customerRepository = new CustomerApiClient(httpClient);
const customerService = new CustomerService(customerRepository);

// Pass service to hook
const useCustomersWithDependencies = () => useCustomers(customerService);

// Component uses the configured hook
const CustomerList = () => {
  const { customers, loading } = useCustomersWithDependencies();
  // ...
};
```

## Implementation Examples

### Core Layer Example

```typescript
// core/entities/customer.ts
export interface Customer {
  readonly id: CustomerId;
  readonly name: string;
  readonly email: Email;
  readonly status: CustomerStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Business rules in the entity
export class CustomerEntity {
  constructor(private data: Customer) {}

  canBeDeleted(): boolean {
    return this.data.status !== "active";
  }

  updateStatus(newStatus: CustomerStatus): Customer {
    if (!this.isValidStatusTransition(this.data.status, newStatus)) {
      throw new Error("Invalid status transition");
    }

    return {
      ...this.data,
      status: newStatus,
      updatedAt: new Date(),
    };
  }

  private isValidStatusTransition(from: CustomerStatus, to: CustomerStatus): boolean {
    // Business logic for valid status transitions
    const validTransitions = {
      prospect: ["active", "inactive"],
      active: ["inactive"],
      inactive: ["active"],
    };

    return validTransitions[from]?.includes(to) ?? false;
  }
}

// core/types/common.ts
export type CustomerId = string;
export type Email = string;
export type CustomerStatus = "prospect" | "active" | "inactive";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

### Feature Domain Layer Example

```typescript
// features/customers/domain/repositories/customer-repository.ts
export interface CustomerRepository {
  findAll(params: FindAllParams): Promise<PaginatedResponse<Customer>>;
  findById(id: CustomerId): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
  delete(id: CustomerId): Promise<void>;
  findByEmail(email: Email): Promise<Customer | null>;
}

export interface FindAllParams {
  page?: number;
  limit?: number;
  status?: CustomerStatus;
  search?: string;
}

// features/customers/domain/services/customer-domain-service.ts
export class CustomerDomainService {
  constructor(private customerRepository: CustomerRepository) {}

  async isEmailUnique(email: Email, excludeId?: CustomerId): Promise<boolean> {
    const existingCustomer = await this.customerRepository.findByEmail(email);

    if (!existingCustomer) return true;
    if (excludeId && existingCustomer.id === excludeId) return true;

    return false;
  }

  async canDeleteCustomer(customerId: CustomerId): Promise<boolean> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) return false;

    const customerEntity = new CustomerEntity(customer);
    return customerEntity.canBeDeleted();
  }
}
```

### Application Layer Example

```typescript
// features/customers/application/use-cases/create-customer.ts
export interface CreateCustomerRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

export interface CreateCustomerResponse {
  customer: Customer;
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository, private customerDomainService: CustomerDomainService) {}

  async execute(request: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    // Validation
    await this.validateRequest(request);

    // Business logic
    const customer: Customer = {
      id: generateId(),
      name: request.name.trim(),
      email: request.email.toLowerCase(),
      company: request.company?.trim() || "",
      phone: request.phone?.trim() || "",
      status: "prospect",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save
    await this.customerRepository.save(customer);

    return { customer };
  }

  private async validateRequest(request: CreateCustomerRequest): Promise<void> {
    if (!request.name?.trim()) {
      throw new ValidationError("Customer name is required");
    }

    if (!isValidEmail(request.email)) {
      throw new ValidationError("Valid email is required");
    }

    const isEmailUnique = await this.customerDomainService.isEmailUnique(request.email);
    if (!isEmailUnique) {
      throw new ValidationError("Email already exists");
    }
  }
}
```

### Infrastructure Layer Example

```typescript
// features/customers/infrastructure/api/customer-api-client.ts
export class CustomerApiClient implements CustomerRepository {
  constructor(private httpClient: HttpClient, private mapper: CustomerMapper) {}

  async findAll(params: FindAllParams): Promise<PaginatedResponse<Customer>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.status) queryParams.set("status", params.status);
    if (params.search) queryParams.set("search", params.search);

    const response = await this.httpClient.get<ApiCustomerListResponse>(`/customers?${queryParams.toString()}`);

    return {
      items: response.data.items.map(this.mapper.toDomain),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
    };
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    try {
      const response = await this.httpClient.get<ApiCustomerResponse>(`/customers/${id}`);
      return this.mapper.toDomain(response.data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async save(customer: Customer): Promise<void> {
    const apiCustomer = this.mapper.toApi(customer);
    await this.httpClient.post("/customers", apiCustomer);
  }
}

// Data mapping between API and domain
export class CustomerMapper {
  toDomain(apiCustomer: ApiCustomer): Customer {
    return {
      id: apiCustomer.id,
      name: apiCustomer.name,
      email: apiCustomer.email,
      company: apiCustomer.company || "",
      phone: apiCustomer.phone || "",
      status: apiCustomer.status,
      createdAt: new Date(apiCustomer.created_at),
      updatedAt: new Date(apiCustomer.updated_at),
    };
  }

  toApi(customer: Customer): ApiCustomer {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      company: customer.company,
      phone: customer.phone,
      status: customer.status,
      created_at: customer.createdAt.toISOString(),
      updated_at: customer.updatedAt.toISOString(),
    };
  }
}
```

### Presentation Layer Example

```typescript
// features/customers/presentation/hooks/use-customers.ts
export const useCustomers = (customerService: CustomerApplicationService) => {
  const [state, setState] = useState<CustomersState>({
    customers: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0 },
  });

  const loadCustomers = useCallback(
    async (params?: LoadCustomersParams) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await customerService.getCustomers(params);
        setState((prev) => ({
          ...prev,
          customers: result.customers,
          pagination: result.pagination,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    },
    [customerService]
  );

  const createCustomer = useCallback(
    async (data: CreateCustomerRequest) => {
      const result = await customerService.createCustomer(data);
      await loadCustomers(); // Refresh list
      return result;
    },
    [customerService, loadCustomers]
  );

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    ...state,
    actions: {
      loadCustomers,
      createCustomer,
    },
  };
};

// features/customers/presentation/components/customer-list.tsx
interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (id: CustomerId) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, loading, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (customers.length === 0) {
    return <EmptyState message="No customers found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  );
};
```

## Benefits & Trade-offs

### Benefits

**1. Maintainability**

- Changes are localized to specific layers
- Clear ownership of code sections
- Easier to understand system behavior

**2. Testability**

- Business logic can be unit tested without UI
- Infrastructure can be mocked easily
- Each layer can be tested independently

**3. Scalability**

- New features follow established patterns
- Teams can work on different features simultaneously
- Code reuse through shared components

**4. Flexibility**

- Can swap implementations (REST → GraphQL) without changing business logic
- Framework changes don't affect core business rules
- Easy to adapt to new requirements

**5. Domain Focus**

- Business rules are explicit and centralized
- Domain experts can understand and validate logic
- Reduces accidental complexity

### Trade-offs

**1. Initial Complexity**

- More files and folders to manage
- Learning curve for new developers
- Overhead for simple applications

**2. Over-engineering Risk**

- May be overkill for small applications
- Can lead to unnecessary abstractions
- Requires discipline to maintain

**3. Development Speed**

- Initial setup takes longer
- More boilerplate code required
- Requires more planning upfront

**4. Team Coordination**

- Need clear communication about interfaces
- Requires architectural understanding from all team members
- More coordination needed for cross-cutting changes

## Best Practices

### 1. Start Simple, Evolve Gradually

```typescript
// Start with a simple structure
features/customers/
├── components/
├── hooks/
└── api/

// Evolve as complexity grows
features/customers/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

### 2. Use Dependency Injection

```typescript
// Create a composition root
export const createCustomerModule = (httpClient: HttpClient) => {
  const repository = new CustomerApiClient(httpClient);
  const domainService = new CustomerDomainService(repository);
  const applicationService = new CustomerApplicationService(repository, domainService);

  return {
    repository,
    domainService,
    applicationService,
  };
};
```

### 3. Define Clear Interfaces

```typescript
// Be explicit about contracts
export interface CustomerRepository {
  findById(id: CustomerId): Promise<Customer | null>;
  // Clear return types, clear parameters
}

// Use TypeScript strictly
export interface CreateCustomerRequest {
  readonly name: string;
  readonly email: string;
  readonly company?: string;
}
```

### 4. Keep Business Logic Pure

```typescript
// Good: Pure business logic
export class CustomerEntity {
  canBeActivated(): boolean {
    return this.status === "prospect" && this.hasValidEmail();
  }
}

// Avoid: Mixed concerns
export class CustomerEntity {
  async canBeActivated(): Promise<boolean> {
    // Don't make API calls in entities
    const hasActiveOrders = await this.orderService.hasActiveOrders(this.id);
    return !hasActiveOrders;
  }
}
```

### 5. Use Error Boundaries

```typescript
// Domain-specific errors
export class CustomerNotFoundError extends Error {
  constructor(id: CustomerId) {
    super(`Customer with id ${id} not found`);
    this.name = "CustomerNotFoundError";
  }
}

// Application-level error handling
export class CustomerApplicationService {
  async getCustomer(id: CustomerId): Promise<Customer> {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundError(id);
    }
    return customer;
  }
}
```

## Testing Strategy

### Unit Testing by Layer

**Core Layer Tests**

```typescript
// Test business logic in isolation
describe("CustomerEntity", () => {
  it("should allow activation for prospect customers", () => {
    const customer = new CustomerEntity({
      id: "1",
      status: "prospect",
      email: "test@example.com",
    });

    expect(customer.canBeActivated()).toBe(true);
  });
});
```

**Application Layer Tests**

```typescript
// Test use cases with mocked dependencies
describe("CreateCustomerUseCase", () => {
  it("should create customer with valid data", async () => {
    const mockRepository = {
      save: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(null),
    };

    const useCase = new CreateCustomerUseCase(mockRepository);
    const result = await useCase.execute({
      name: "John Doe",
      email: "john@example.com",
    });

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.customer.name).toBe("John Doe");
  });
});
```

**Integration Tests**

```typescript
// Test layer interactions
describe("Customer Feature Integration", () => {
  it("should handle complete customer creation flow", async () => {
    const testServer = new TestServer();
    const httpClient = new HttpClient(testServer.url);
    const customerModule = createCustomerModule(httpClient);

    const result = await customerModule.applicationService.createCustomer({
      name: "Integration Test Customer",
      email: "integration@test.com",
    });

    expect(result.customer.id).toBeDefined();
  });
});
```

**Component Tests**

```typescript
// Test UI components with mocked services
describe("CustomerList", () => {
  it("should display customers", () => {
    const mockCustomers = [{ id: "1", name: "John Doe", email: "john@example.com" }];

    render(<CustomerList customers={mockCustomers} loading={false} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
```

### Testing Architecture

```
Tests Mirror Source Structure:
├── src/
│   └── features/customers/
│       ├── domain/
│       ├── application/
│       └── presentation/
└── tests/
    └── features/customers/
        ├── domain/
        ├── application/
        ├── integration/
        └── presentation/
```

---

## Conclusion

Clean Architecture for React applications provides a robust foundation that grows with your application's complexity. While it requires more initial setup and discipline, the benefits of maintainability, testability, and scalability make it worthwhile for medium to large applications.

**When to use Clean Architecture:**

- ✅ Complex business rules
- ✅ Multiple team members
- ✅ Long-term maintenance expected
- ✅ Need for extensive testing
- ✅ Integration with multiple external systems

**When simpler approaches might suffice:**

- ❌ Small, simple applications
- ❌ Prototypes or short-term projects
- ❌ Very small teams (1-2 developers)
- ❌ Simple CRUD operations only
