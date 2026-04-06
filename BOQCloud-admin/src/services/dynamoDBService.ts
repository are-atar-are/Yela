import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const REGION = process.env.REACT_APP_AWS_REGION || 'eu-north-1';
const VEHICLES_TABLE = process.env.REACT_APP_DYNAMODB_TABLE_VEHICLES || 'FleetoVehicles';
const BOOKINGS_TABLE = process.env.REACT_APP_DYNAMODB_TABLE_BOOKINGS || 'FleetoBookings';

// Check if we have credentials
const hasCredentials = process.env.REACT_APP_AWS_ACCESS_KEY_ID && process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const getDynamoDBClient = () => {
  if (!hasCredentials) {
    throw new Error('AWS credentials not configured');
  }
  
  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
    },
  });
  
  return DynamoDBDocumentClient.from(client);
};

// Vehicle Types
export interface Vehicle {
  vehicleId: string;
  name: string;
  description: string;
  category: 'bakkie' | 'hatch' | 'sedan' | 'suv' | 'other';
  photoUrl: string;
  isActive: boolean;
  defaultAvailableStartTime: string;
  defaultAvailableEndTime: string;
  availableDays: string[];
  minimumBookingHours: number;
  maximumBookingDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInput {
  name: string;
  description: string;
  category: 'bakkie' | 'hatch' | 'sedan' | 'suv' | 'other';
  photoUrl: string;
  isActive?: boolean;
  defaultAvailableStartTime?: string;
  defaultAvailableEndTime?: string;
  availableDays?: string[];
  minimumBookingHours?: number;
  maximumBookingDays?: number;
}

// Booking Types
export interface Booking {
  vehicleId: string;
  bookingId: string;
  userId: string;
  userName?: string;
  vehicleName?: string;
  startDateTime: string;
  endDateTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInput {
  vehicleId: string;
  userId: string;
  startDateTime: string;
  endDateTime: string;
  notes?: string;
}

class DynamoDBService {
  private docClient: DynamoDBDocumentClient | null = null;

  constructor() {
    try {
      this.docClient = getDynamoDBClient();
    } catch (error) {
      console.warn('DynamoDB client not initialized:', error);
    }
  }

  isConfigured(): boolean {
    return this.docClient !== null;
  }

  // ==================== VEHICLE OPERATIONS ====================

  // Get all vehicles
  async getAllVehicles(): Promise<Vehicle[]> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new ScanCommand({
          TableName: VEHICLES_TABLE,
        })
      );
      return (result.Items as Vehicle[]) || [];
    } catch (error) {
      console.error('Error getting vehicles:', error);
      throw error;
    }
  }

  // Get vehicles by category
  async getVehiclesByCategory(category: string): Promise<Vehicle[]> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: VEHICLES_TABLE,
          IndexName: 'CategoryIndex',
          KeyConditionExpression: '#category = :category',
          ExpressionAttributeNames: {
            '#category': 'category',
          },
          ExpressionAttributeValues: {
            ':category': category,
          },
        })
      );
      return (result.Items as Vehicle[]) || [];
    } catch (error) {
      console.error('Error getting vehicles by category:', error);
      throw error;
    }
  }

  // Get a single vehicle
  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: VEHICLES_TABLE,
          Key: { vehicleId },
        })
      );
      return (result.Item as Vehicle) || null;
    } catch (error) {
      console.error('Error getting vehicle:', error);
      throw error;
    }
  }

  // Create a new vehicle
  async createVehicle(vehicleInput: VehicleInput): Promise<Vehicle> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    const now = new Date().toISOString();
    const vehicle: Vehicle = {
      vehicleId: `vh-${Date.now()}`,
      ...vehicleInput,
      isActive: vehicleInput.isActive !== false,
      defaultAvailableStartTime: vehicleInput.defaultAvailableStartTime || '08:00',
      defaultAvailableEndTime: vehicleInput.defaultAvailableEndTime || '18:00',
      availableDays: vehicleInput.availableDays || ['mon', 'tue', 'wed', 'thu', 'fri'],
      minimumBookingHours: vehicleInput.minimumBookingHours || 1,
      maximumBookingDays: vehicleInput.maximumBookingDays || 1,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await this.docClient.send(
        new PutCommand({
          TableName: VEHICLES_TABLE,
          Item: vehicle,
        })
      );
      return vehicle;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  // Update a vehicle
  async updateVehicle(vehicleId: string, updates: Partial<VehicleInput>): Promise<Vehicle> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    try {
      const result = await this.docClient.send(
        new UpdateCommand({
          TableName: VEHICLES_TABLE,
          Key: { vehicleId },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes as Vehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  // Delete a vehicle
  async deleteVehicle(vehicleId: string): Promise<void> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: VEHICLES_TABLE,
          Key: { vehicleId },
        })
      );
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }

  // Toggle vehicle active status
  async toggleVehicleStatus(vehicleId: string, currentStatus: boolean): Promise<Vehicle> {
    return this.updateVehicle(vehicleId, { isActive: !currentStatus });
  }

  // ==================== BOOKING OPERATIONS ====================

  // Get all bookings
  async getAllBookings(): Promise<Booking[]> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new ScanCommand({
          TableName: BOOKINGS_TABLE,
        })
      );
      return (result.Items as Booking[]) || [];
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw error;
    }
  }

  // Get bookings for a vehicle
  async getBookingsForVehicle(vehicleId: string): Promise<Booking[]> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: BOOKINGS_TABLE,
          KeyConditionExpression: 'vehicleId = :vehicleId',
          ExpressionAttributeValues: {
            ':vehicleId': vehicleId,
          },
        })
      );
      return (result.Items as Booking[]) || [];
    } catch (error) {
      console.error('Error getting bookings for vehicle:', error);
      throw error;
    }
  }

  // Get bookings for a user
  async getBookingsForUser(userId: string): Promise<Booking[]> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: BOOKINGS_TABLE,
          IndexName: 'UserIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
        })
      );
      return (result.Items as Booking[]) || [];
    } catch (error) {
      console.error('Error getting bookings for user:', error);
      throw error;
    }
  }

  // Get a single booking
  async getBooking(vehicleId: string, bookingId: string): Promise<Booking | null> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: BOOKINGS_TABLE,
          Key: { vehicleId, bookingId },
        })
      );
      return (result.Item as Booking) || null;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  // Create a booking
  async createBooking(bookingInput: BookingInput): Promise<Booking> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    const now = new Date().toISOString();
    const booking: Booking = {
      ...bookingInput,
      notes: bookingInput.notes || '',
      bookingId: `bk-${Date.now()}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await this.docClient.send(
        new PutCommand({
          TableName: BOOKINGS_TABLE,
          Item: booking,
        })
      );
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(
    vehicleId: string,
    bookingId: string,
    status: Booking['status']
  ): Promise<Booking> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      const result = await this.docClient.send(
        new UpdateCommand({
          TableName: BOOKINGS_TABLE,
          Key: { vehicleId, bookingId },
          UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString(),
          },
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes as Booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Delete a booking
  async deleteBooking(vehicleId: string, bookingId: string): Promise<void> {
    if (!this.docClient) {
      throw new Error('DynamoDB not configured');
    }

    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: BOOKINGS_TABLE,
          Key: { vehicleId, bookingId },
        })
      );
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Check if vehicle is available for a time range
  async isVehicleAvailable(
    vehicleId: string,
    startDateTime: string,
    endDateTime: string,
    excludeBookingId?: string
  ): Promise<boolean> {
    const bookings = await this.getBookingsForVehicle(vehicleId);
    
    const conflictingBooking = bookings.find(booking => {
      if (booking.status === 'cancelled') return false;
      if (excludeBookingId && booking.bookingId === excludeBookingId) return false;
      
      const bookingStart = new Date(booking.startDateTime);
      const bookingEnd = new Date(booking.endDateTime);
      const requestStart = new Date(startDateTime);
      const requestEnd = new Date(endDateTime);
      
      return (
        (requestStart >= bookingStart && requestStart < bookingEnd) ||
        (requestEnd > bookingStart && requestEnd <= bookingEnd) ||
        (requestStart <= bookingStart && requestEnd >= bookingEnd)
      );
    });
    
    return !conflictingBooking;
  }
}

export const dynamoDBService = new DynamoDBService();
export default dynamoDBService;
