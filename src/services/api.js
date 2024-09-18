import { faker } from '@faker-js/faker';
let estimates = [
  {
    id: '00001',
    client: 'Christine Brooks',
    project: 'Electric Project',
    status: 'Created',
    createdDate: '2023-09-04',
    modifiedDate: '2023-09-12',
    sections: [
      {
        id: 1,
        title: 'Electric',
        items: [
          { id: 1, title: 'Lamps', description: 'Item Description', unit: 'QTY', quantity: 100, price: 10000, margin: 10 },
          { id: 2, title: 'Wires', description: 'Item Description', unit: 'Meter', quantity: 200, price: 4000, margin: 0 },
        ]
      }
    ]
  }
];

let projects = Array.from({ length: 12 }).map(() => ({
  customer: faker.person.fullName(),
  refNumber: faker.string.alphanumeric(12).toUpperCase(),
  projectName: faker.commerce.productName(),
  projectReference: faker.string.alphanumeric(10).toUpperCase(),
  projectNumber: faker.string.alphanumeric(8).toUpperCase(),
  location: `${faker.location.city()}, ${faker.location.state()}`,
  createdDate: faker.date.past({ years: 1 }),
  status: faker.helpers.arrayElement(["In Progress", "Completed", "Pending"]),
}));

const api = {
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsers: faker.number.int(50000),
          totalOrders: faker.number.int(20000),
          totalSales: faker.commerce.price({ min: 50000, max: 100000 }),
          totalPending: faker.number.int(3000),
        });
      }, 1000);
    });
  },
  getSalesData: async () => {
    return new Promise((resolve) => {
      const data = Array.from({ length: 12 }).map((_, index) => ({
        date: `2024-${index + 1}-01`,
        sales: faker.number.int({ min: 1000, max: 5000 }),
      }));
      resolve(data);
    });
  },
  getProjects: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 1000);
    });
  },
  addProject: async (newProject) => {
    return new Promise((resolve) => {
      const project = {
        ...newProject,
        refNumber: faker.string.alphanumeric(12).toUpperCase(),
        createdDate: new Date(),
      };
      projects.unshift(project);
      setTimeout(() => resolve(project), 500);
    });
  },
  updateProject: async (refNumber, updatedProject) => {
    return new Promise((resolve, reject) => {
      const index = projects.findIndex((p) => p.refNumber === refNumber);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedProject };
        setTimeout(() => resolve(projects[index]), 500);
      } else {
        reject(new Error('Project not found'));
      }
    });
  },
  deleteProject: async (refNumber) => {
    return new Promise((resolve, reject) => {
      const index = projects.findIndex((p) => p.refNumber === refNumber);
      if (index !== -1) {
        projects.splice(index, 1);
        setTimeout(() => resolve(true), 500);
      } else {
        reject(new Error('Project not found'));
      }
    });
  },
  getEstimates: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(estimates), 1000);
    });
  },
  addEstimate: async (estimate) => {
    const now = new Date().toISOString().split('T')[0];
    const newEstimate = {
      ...estimate,
      id: `0000${estimates.length + 1}`,
      createdDate: now,
      modifiedDate: now,
    };
    estimates.push(newEstimate);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newEstimate), 1000);
    });
  },

  updateEstimate: async (id, updatedEstimate) => {
    const now = new Date().toISOString().split('T')[0];
    estimates = estimates.map((estimate) =>
      estimate.id === id
        ? { ...estimate, ...updatedEstimate, modifiedDate: now }
        : estimate
    );
    return new Promise((resolve) => {
      setTimeout(() => resolve(estimates.find(e => e.id === id)), 1000);
    });
  },

  deleteEstimate: async (id) => {
    return new Promise((resolve) => {
      estimates = estimates.filter((estimate) => estimate.id !== id);
      setTimeout(() => resolve(estimates), 1000);
    });
  },    
};

export default api;
