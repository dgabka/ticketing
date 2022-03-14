import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = await Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  }).save();

  const tic1 = await Ticket.findById(ticket.id);
  const tic2 = await Ticket.findById(ticket.id);

  tic1!.set({ price: 10 });
  tic2!.set({ price: 15 });

  await tic1!.save();

  await expect(tic2!.save()).rejects.toThrowError();
});

it('increments the version number on multiple saves', async () => {
  const ticket = await Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  }).save();
  expect(ticket.version).toEqual(0);

  ticket.set({ price: 10 });
  await ticket.save();
  expect(ticket.version).toEqual(1);

  ticket.set({ price: 15 });
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
