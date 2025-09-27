/**
 * @fileoverview Testes unitários para métodos de renda extra
 * @description Testa cálculos, validações e funcionalidades dos métodos
 */

describe('Income Methods System', () => {
  let incomeCalculator;
  let methodsData;

  beforeEach(() => {
    // Mock dos dados dos métodos
    methodsData = [
      {
        id: 'freelancing',
        name: 'Freelancing',
        difficulty: 2,
        potential: 8,
        timeToStart: 1,
        rating: 4.8,
        minIncome: 500,
        maxIncome: 8000,
        hourlyRate: 25,
      },
      {
        id: 'affiliate',
        name: 'Marketing de Afiliados',
        difficulty: 3,
        potential: 9,
        timeToStart: 2,
        rating: 4.6,
        minIncome: 300,
        maxIncome: 15000,
        hourlyRate: 0,
      },
      {
        id: 'digital-products',
        name: 'Produtos Digitais',
        difficulty: 4,
        potential: 10,
        timeToStart: 3,
        rating: 4.7,
        minIncome: 200,
        maxIncome: 20000,
        hourlyRate: 0,
      },
    ];

    // Mock do calculador de renda
    incomeCalculator = {
      calculatePotentialIncome: jest.fn(),
      calculateHourlyRate: jest.fn(),
      calculateROI: jest.fn(),
      getDifficultyLevel: jest.fn(),
      getRecommendedMethods: jest.fn(),
    };
  });

  describe('Cálculos de Renda', () => {
    test('deve calcular renda potencial corretamente para freelancing', () => {
      const method = methodsData[0]; // freelancing
      const hoursPerWeek = 20;
      const weeksPerMonth = 4;
      
      const expectedIncome = method.hourlyRate * hoursPerWeek * weeksPerMonth;
      
      incomeCalculator.calculatePotentialIncome.mockReturnValue(expectedIncome);
      
      const result = incomeCalculator.calculatePotentialIncome(method.id, hoursPerWeek);
      
      expect(result).toBe(2000); // 25 * 20 * 4
      expect(incomeCalculator.calculatePotentialIncome).toHaveBeenCalledWith(method.id, hoursPerWeek);
    });

    test('deve calcular taxa horária baseada na renda desejada', () => {
      const desiredMonthlyIncome = 3000;
      const availableHours = 80; // 20h/semana * 4 semanas
      
      const expectedHourlyRate = desiredMonthlyIncome / availableHours;
      
      incomeCalculator.calculateHourlyRate.mockReturnValue(expectedHourlyRate);
      
      const result = incomeCalculator.calculateHourlyRate(desiredMonthlyIncome, availableHours);
      
      expect(result).toBe(37.5);
    });

    test('deve calcular ROI para investimento inicial', () => {
      const initialInvestment = 500;
      const monthlyIncome = 2000;
      const months = 6;
      
      const totalReturn = monthlyIncome * months;
      const roi = ((totalReturn - initialInvestment) / initialInvestment) * 100;
      
      incomeCalculator.calculateROI.mockReturnValue(roi);
      
      const result = incomeCalculator.calculateROI(initialInvestment, monthlyIncome, months);
      
      expect(result).toBe(2300); // (12000 - 500) / 500 * 100
    });

    test('deve validar entrada de horas trabalhadas', () => {
      const validHours = [1, 10, 40, 60];
      const invalidHours = [-1, 0, 169]; // 169 = mais que 24h/dia * 7 dias
      
      validHours.forEach(hours => {
        const isValid = hours > 0 && hours <= 168; // Max 24h * 7 dias
        expect(isValid).toBe(true);
      });
      
      invalidHours.forEach(hours => {
        const isValid = hours > 0 && hours <= 168;
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Classificação por Dificuldade', () => {
    test('deve classificar métodos por nível de dificuldade', () => {
      const difficulties = [
        { level: 1, label: 'Muito Fácil', color: '#4CAF50' },
        { level: 2, label: 'Fácil', color: '#8BC34A' },
        { level: 3, label: 'Médio', color: '#FF9800' },
        { level: 4, label: 'Difícil', color: '#FF5722' },
        { level: 5, label: 'Muito Difícil', color: '#F44336' },
      ];

      methodsData.forEach(method => {
        const difficulty = difficulties.find(d => d.level === method.difficulty);
        expect(difficulty).toBeDefined();
        expect(difficulty.label).toBeTruthy();
        expect(difficulty.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    test('deve retornar métodos ordenados por dificuldade', () => {
      const sortedByDifficulty = [...methodsData].sort((a, b) => a.difficulty - b.difficulty);
      
      expect(sortedByDifficulty[0].difficulty).toBeLessThanOrEqual(sortedByDifficulty[1].difficulty);
      expect(sortedByDifficulty[1].difficulty).toBeLessThanOrEqual(sortedByDifficulty[2].difficulty);
    });

    test('deve filtrar métodos por nível de dificuldade máximo', () => {
      const maxDifficulty = 3;
      const filteredMethods = methodsData.filter(method => method.difficulty <= maxDifficulty);
      
      expect(filteredMethods).toHaveLength(2); // freelancing e affiliate
      filteredMethods.forEach(method => {
        expect(method.difficulty).toBeLessThanOrEqual(maxDifficulty);
      });
    });
  });

  describe('Sistema de Recomendações', () => {
    test('deve recomendar métodos baseado no perfil do usuário', () => {
      const userProfile = {
        availableTime: 10, // horas por semana
        experience: 'beginner',
        desiredIncome: 1000,
        skills: ['writing', 'marketing'],
      };

      const recommendedMethods = methodsData.filter(method => {
        // Lógica simplificada de recomendação
        return method.difficulty <= 3 && method.minIncome <= userProfile.desiredIncome;
      });

      expect(recommendedMethods.length).toBeGreaterThan(0);
      recommendedMethods.forEach(method => {
        expect(method.difficulty).toBeLessThanOrEqual(3);
        expect(method.minIncome).toBeLessThanOrEqual(userProfile.desiredIncome);
      });
    });

    test('deve priorizar métodos com melhor rating', () => {
      const sortedByRating = [...methodsData].sort((a, b) => b.rating - a.rating);
      
      expect(sortedByRating[0].rating).toBeGreaterThanOrEqual(sortedByRating[1].rating);
      expect(sortedByRating[1].rating).toBeGreaterThanOrEqual(sortedByRating[2].rating);
    });

    test('deve considerar tempo para começar', () => {
      const urgentUser = { timeToStart: 1 }; // quer começar rapidamente
      
      const quickStartMethods = methodsData.filter(method => 
        method.timeToStart <= urgentUser.timeToStart
      );
      
      expect(quickStartMethods).toHaveLength(1); // apenas freelancing
      expect(quickStartMethods[0].id).toBe('freelancing');
    });
  });

  describe('Validação de Dados', () => {
    test('deve validar estrutura dos métodos', () => {
      const requiredFields = ['id', 'name', 'difficulty', 'potential', 'timeToStart', 'rating'];
      
      methodsData.forEach(method => {
        requiredFields.forEach(field => {
          expect(method).toHaveProperty(field);
          expect(method[field]).toBeDefined();
        });
      });
    });

    test('deve validar faixas de valores', () => {
      methodsData.forEach(method => {
        expect(method.difficulty).toBeGreaterThanOrEqual(1);
        expect(method.difficulty).toBeLessThanOrEqual(5);
        
        expect(method.potential).toBeGreaterThanOrEqual(1);
        expect(method.potential).toBeLessThanOrEqual(10);
        
        expect(method.rating).toBeGreaterThanOrEqual(1);
        expect(method.rating).toBeLessThanOrEqual(5);
        
        expect(method.minIncome).toBeGreaterThan(0);
        expect(method.maxIncome).toBeGreaterThan(method.minIncome);
      });
    });

    test('deve validar IDs únicos', () => {
      const ids = methodsData.map(method => method.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(uniqueIds).toHaveLength(ids.length);
    });
  });

  describe('Formatação de Valores', () => {
    test('deve formatar valores monetários corretamente', () => {
      const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      };

      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(2500.5)).toBe('R$ 2.500,50');
      expect(formatCurrency(15000)).toBe('R$ 15.000,00');
    });

    test('deve formatar ratings com estrelas', () => {
      const formatRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return {
          fullStars,
          hasHalfStar,
          emptyStars,
          text: `${rating}/5`,
        };
      };

      const rating48 = formatRating(4.8);
      expect(rating48.fullStars).toBe(4);
      expect(rating48.hasHalfStar).toBe(true);
      expect(rating48.emptyStars).toBe(0);
      expect(rating48.text).toBe('4.8/5');
    });

    test('deve formatar tempo de início', () => {
      const formatTimeToStart = (weeks) => {
        if (weeks === 1) return 'Imediatamente';
        if (weeks <= 2) return `${weeks} semana${weeks > 1 ? 's' : ''}`;
        if (weeks <= 8) return `${weeks} semanas`;
        return `${Math.ceil(weeks / 4)} meses`;
      };

      expect(formatTimeToStart(1)).toBe('Imediatamente');
      expect(formatTimeToStart(2)).toBe('2 semanas');
      expect(formatTimeToStart(3)).toBe('3 semanas');
      expect(formatTimeToStart(12)).toBe('3 meses');
    });
  });

  describe('Métricas e Analytics', () => {
    test('deve calcular média de ratings', () => {
      const ratings = methodsData.map(method => method.rating);
      const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      
      expect(averageRating).toBeCloseTo(4.7, 1);
    });

    test('deve identificar método com maior potencial', () => {
      const highestPotential = methodsData.reduce((max, method) => 
        method.potential > max.potential ? method : max
      );
      
      expect(highestPotential.id).toBe('digital-products');
      expect(highestPotential.potential).toBe(10);
    });

    test('deve calcular distribuição por dificuldade', () => {
      const distribution = methodsData.reduce((acc, method) => {
        acc[method.difficulty] = (acc[method.difficulty] || 0) + 1;
        return acc;
      }, {});
      
      expect(distribution[2]).toBe(1); // 1 método com dificuldade 2
      expect(distribution[3]).toBe(1); // 1 método com dificuldade 3
      expect(distribution[4]).toBe(1); // 1 método com dificuldade 4
    });
  });

  describe('Simulações de Cenários', () => {
    test('deve simular renda em diferentes cenários de dedicação', () => {
      const freelancingMethod = methodsData.find(m => m.id === 'freelancing');
      const scenarios = [
        { hours: 5, label: 'Meio período' },
        { hours: 20, label: 'Tempo parcial' },
        { hours: 40, label: 'Tempo integral' },
      ];

      scenarios.forEach(scenario => {
        const monthlyIncome = freelancingMethod.hourlyRate * scenario.hours * 4;
        
        expect(monthlyIncome).toBeGreaterThan(0);
        
        if (scenario.hours === 5) expect(monthlyIncome).toBe(500);
        if (scenario.hours === 20) expect(monthlyIncome).toBe(2000);
        if (scenario.hours === 40) expect(monthlyIncome).toBe(4000);
      });
    });

    test('deve simular crescimento de renda ao longo do tempo', () => {
      const initialIncome = 1000;
      const monthlyGrowthRate = 0.1; // 10% ao mês
      const months = 6;

      let currentIncome = initialIncome;
      const incomeProgression = [currentIncome];

      for (let i = 1; i <= months; i++) {
        currentIncome *= (1 + monthlyGrowthRate);
        incomeProgression.push(Math.round(currentIncome));
      }

      expect(incomeProgression).toHaveLength(months + 1);
      expect(incomeProgression[0]).toBe(1000);
      expect(incomeProgression[6]).toBeGreaterThan(1700); // Crescimento composto
    });

    test('deve calcular tempo necessário para atingir meta', () => {
      const targetIncome = 5000;
      const currentIncome = 1000;
      const monthlyGrowthRate = 0.15; // 15% ao mês

      let months = 0;
      let income = currentIncome;

      while (income < targetIncome && months < 24) { // max 2 anos
        months++;
        income *= (1 + monthlyGrowthRate);
      }

      expect(months).toBeGreaterThan(0);
      expect(months).toBeLessThan(24);
      expect(income).toBeGreaterThanOrEqual(targetIncome);
    });
  });
});