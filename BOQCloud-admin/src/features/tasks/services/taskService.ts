import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskInput, TaskUpdate } from '../types/task.types';

// Initialize DynamoDB client with credentials from environment
const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.REACT_APP_DYNAMODB_TABLE || 'FleetoTasks';

class TaskService {
  // Create a new task
  async createTask(userId: string, taskInput: TaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      userId,
      taskId: uuidv4(),
      ...taskInput,
      tags: taskInput.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: task,
      })
    );

    return task;
  }

  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    return (result.Items as Task[]) || [];
  }

  // Get tasks by status
  async getTasksByStatus(userId: string, status: string): Promise<Task[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'StatusIndex',
        KeyConditionExpression: '#status = :status AND userId = :userId',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':userId': userId,
        },
      })
    );

    return (result.Items as Task[]) || [];
  }

  // Get a single task
  async getTask(userId: string, taskId: string): Promise<Task | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          userId,
          taskId,
        },
      })
    );

    return (result.Item as Task) || null;
  }

  // Update a task
  async updateTask(
    userId: string,
    taskId: string,
    updates: TaskUpdate
  ): Promise<Task> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build update expression dynamically
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          userId,
          taskId,
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as Task;
  }

  // Delete a task
  async deleteTask(userId: string, taskId: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          userId,
          taskId,
        },
      })
    );
  }

  // Search tasks
  async searchTasks(userId: string, query: string): Promise<Task[]> {
    // Note: In production, use Elasticsearch or OpenSearch for full-text search
    // This is a simple scan for demo purposes
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'userId = :userId AND contains(#title, :query)',
        ExpressionAttributeNames: {
          '#title': 'title',
        },
        ExpressionAttributeValues: {
          ':userId': userId,
          ':query': query,
        },
      })
    );

    return (result.Items as Task[]) || [];
  }

  // Toggle task status
  async toggleTaskStatus(
    userId: string,
    taskId: string,
    currentStatus: string
  ): Promise<Task> {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return this.updateTask(userId, taskId, { status: newStatus as any });
  }
}

export const taskService = new TaskService();
export default taskService;
