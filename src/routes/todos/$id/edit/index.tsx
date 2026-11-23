import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ArrowLeftIcon } from 'lucide-react'
import { TodoForm } from '#/components/todo-form.tsx';
import { createServerFn } from '@tanstack/react-start';
import { db } from '#/db/index.ts';

const loaderFn = createServerFn({ method: "GET" })
    .validator((data: { id: string }) => data)
    .handler( async ({ data }) => {
      const todo = await db.query.todos.findFirst({
        where: (todo, { eq }) => eq(todo.id, data.id)
      });

      if (!todo) throw notFound();
      return todo;
    });


export const Route = createFileRoute('/todos/$id/edit/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return loaderFn({ data: params });
  }
})



function RouteComponent() {
  const todo = Route.useLoaderData();
  return (
    <div className="container space-y-2">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
      >
        <Link to="/">
          <ArrowLeftIcon /> Todo List
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Todo</CardTitle>
          <CardDescription>
            Update the details of your todo item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm todo={todo} />
        </CardContent>
      </Card>
    </div>
  )
}
