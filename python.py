import torch
import torch.nn as nn
import torch.optim as optim

# Example data (normalized)
X_train_tensor = torch.tensor(df[['stress_normalized', 'exercise_minutes']].values, dtype=torch.float32)
y_train_tensor = torch.tensor(df['bmi'].values, dtype=torch.float32).view(-1, 1)

# Define the neural network model
class HealthModel(nn.Module):
    def __init__(self):
        super(HealthModel, self).__init__()
        self.fc1 = nn.Linear(2, 64)  # Input layer
        self.fc2 = nn.Linear(64, 32)  # Hidden layer
        self.fc3 = nn.Linear(32, 1)   # Output layer

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# Initialize the model, loss function, and optimizer
model = HealthModel()
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
for epoch in range(1000):
    model.train()

    # Forward pass
    outputs = model(X_train_tensor)
    loss = criterion(outputs, y_train_tensor)

    # Backward pass and optimization
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if epoch % 100 == 0:
        print(f"Epoch [{epoch}/1000], Loss: {loss.item()}")

# Predict BMI for new data
model.eval()
new_data_tensor = torch.tensor([[0.5, 50]], dtype=torch.float32)  # Example normalized stress and exercise
predicted_bmi = model(new_data_tensor)
print(f"Predicted BMI: {predicted_bmi.item()}")
