"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

interface User {
  id: string;
  name: string;
  email: string;
}

interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  mealPlan: MealPlan;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUserId, setFilterUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");

      return;
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/");

      return;
    }

    fetchSubscriptions();
    fetchUsers();
  }, [session, status, router]);

  const fetchSubscriptions = async (userId?: string) => {
    try {
      setIsLoading(true);
      const url = userId
        ? `/api/subscriptions?userId=${userId}`
        : "/api/subscriptions";
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to fetch subscriptions");
      }

      const data = await response.json();

      setSubscriptions(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Extract unique users from subscriptions for filtering
      const response = await fetch("/api/subscriptions");

      if (response.ok) {
        const data = await response.json();
        const uniqueUsers = data.reduce((acc: User[], sub: Subscription) => {
          if (!acc.find((u) => u.id === sub.user.id)) {
            acc.push(sub.user);
          }

          return acc;
        }, []);

        setUsers(uniqueUsers);
      }
    } catch {
      // Error silently handled - users will see empty state
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions?id=${subscriptionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to delete subscription");
      }

      // Refresh subscriptions
      fetchSubscriptions(filterUserId || undefined);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete subscription",
      );
    }
  };

  const handleUpdateSubscriptionStatus = async (
    subscriptionId: string,
    newStatus: string,
  ) => {
    try {
      const response = await fetch("/api/subscriptions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to update subscription");
      }

      // Refresh subscriptions
      fetchSubscriptions(filterUserId || undefined);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update subscription",
      );
    }
  };

  const handleFilterChange = (userId: string) => {
    setFilterUserId(userId);
    fetchSubscriptions(userId || undefined);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="mb-8">
        <CardHeader>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            Manage all user subscriptions and monitor system activity.
          </p>
        </CardBody>
      </Card>

      {error && (
        <Card className="mb-6 border-danger">
          <CardBody>
            <p className="text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Filter Subscriptions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button
              color={!filterUserId ? "primary" : "default"}
              variant={!filterUserId ? "solid" : "bordered"}
              onClick={() => handleFilterChange("")}
            >
              All Subscriptions
            </Button>

            <Select
              className="max-w-xs"
              label="Filter by User"
              placeholder="Select a user"
              selectedKeys={filterUserId ? [filterUserId] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;

                handleFilterChange(selectedKey || "");
              }}
            >
              {users.map((user) => (
                <SelectItem key={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            {filterUserId ? "User Subscriptions" : "All Subscriptions"} (
            {subscriptions.length})
          </h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No subscriptions found.
            </p>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id} className="border">
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {subscription.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {subscription.user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          User ID: {subscription.userId}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium">
                          {subscription.mealPlan.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ${subscription.mealPlan.price}/month
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {subscription.mealTypes.map((mealType) => (
                            <Chip
                              key={mealType}
                              color="primary"
                              size="sm"
                              variant="flat"
                            >
                              {mealType}
                            </Chip>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Status:</span>
                          <Chip
                            color={
                              subscription.status === "ACTIVE"
                                ? "success"
                                : subscription.status === "PAUSED"
                                  ? "warning"
                                  : "danger"
                            }
                            size="sm"
                          >
                            {subscription.status}
                          </Chip>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {subscription.deliveryDays.map((day) => (
                            <Chip key={day} size="sm" variant="bordered">
                              {day}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(
                            subscription.createdAt,
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Updated:</span>{" "}
                          {new Date(
                            subscription.updatedAt,
                          ).toLocaleDateString()}
                        </p>
                        {subscription.allergies && (
                          <p className="text-sm">
                            <span className="font-medium">Allergies:</span>{" "}
                            {subscription.allergies}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <Select
                          className="max-w-40"
                          label="Change Status"
                          placeholder="Select status"
                          selectedKeys={[subscription.status]}
                          onSelectionChange={(keys) => {
                            const newStatus = Array.from(keys)[0] as string;

                            if (
                              newStatus &&
                              newStatus !== subscription.status
                            ) {
                              handleUpdateSubscriptionStatus(
                                subscription.id,
                                newStatus,
                              );
                            }
                          }}
                        >
                          <SelectItem key="ACTIVE">Active</SelectItem>
                          <SelectItem key="PAUSED">Paused</SelectItem>
                          <SelectItem key="CANCELLED">Cancelled</SelectItem>
                        </Select>

                        <Button
                          color="danger"
                          size="sm"
                          variant="bordered"
                          onClick={() =>
                            handleDeleteSubscription(subscription.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
