import * as React from 'react';
import { IMintextDatagridWepartProps } from './IMintextDatagridWepartProps';

// 1. Import Mantine Components & Icons
import { 
  MantineProvider, 
  Table, 
  Paper, 
  Badge, 
  ActionIcon, 
  Group, 
  Text, 
  Title,
  Modal,
  Button,
  TextInput,
  NumberInput,
  Select,
  Stack,
  Pagination, // <-- Imported Pagination
  Divider,
  Box
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

// 2. Define your Data Interface
interface IGridItem {
  id: number;
  title: string;
  category: string;
  amount: number;
  status: 'Active' | 'Pending' | 'Closed';
  date: string;
}

// 3. Expanded Static Data (so we can see pagination in action)
const initialData: IGridItem[] = [
  { id: 1, title: "Alpha Implementation", category: "Core", amount: 50000, status: "Active", date: "2026-03-24" },
  { id: 2, title: "Beta Migration", category: "Consulting", amount: 12000, status: "Pending", date: "2026-04-02" },
  { id: 3, title: "Gamma Audit", category: "Core", amount: 8500, status: "Closed", date: "2026-01-15" },
  { id: 4, title: "Delta Optimization", category: "Finance", amount: 25000, status: "Active", date: "2026-03-30" },
  { id: 5, title: "Epsilon Upgrade", category: "IT", amount: 75000, status: "Pending", date: "2026-05-10" },
  { id: 6, title: "Zeta Deployment", category: "Core", amount: 45000, status: "Active", date: "2026-06-01" },
  { id: 7, title: "Eta Structuring", category: "Finance", amount: 18000, status: "Closed", date: "2026-02-20" },
  { id: 8, title: "Theta Analysis", category: "Consulting", amount: 32000, status: "Pending", date: "2026-04-15" },
  { id: 9, title: "Iota Integration", category: "IT", amount: 61000, status: "Active", date: "2026-07-11" },
  { id: 10, title: "Kappa Review", category: "Core", amount: 9000, status: "Closed", date: "2026-01-05" },
  { id: 11, title: "Lambda Hosting", category: "IT", amount: 11500, status: "Active", date: "2026-03-28" },
];

const ITEMS_PER_PAGE = 5; // Define how many rows per page

// 4. Update the Component State Interface
interface IMintextDatagridState {
  items: IGridItem[];
  isModalOpen: boolean;
  editingItem: IGridItem | null;
  activePage: number; // <-- Added activePage state
}

export default class MintextDatagridWepart extends React.Component<IMintextDatagridWepartProps, IMintextDatagridState> {
  
  constructor(props: IMintextDatagridWepartProps) {
    super(props);
    this.state = {
      items: initialData,
      isModalOpen: false,
      editingItem: null,
      activePage: 1 // <-- Initialize at page 1
    };
  }

  // ─── ACTIONS ──────────────────────────────────────────────────────────

  private handleEditClick = (item: IGridItem) => {
    this.setState({ 
      editingItem: { ...item }, 
      isModalOpen: true 
    });
  };

  private handleCloseModal = () => {
    this.setState({ isModalOpen: false, editingItem: null });
  };

  private handleFieldChange = (field: keyof IGridItem, value: any) => {
    this.setState((prevState) => {
      if (!prevState.editingItem) return null;
      return { editingItem: { ...prevState.editingItem, [field]: value } };
    });
  };

  private handleSaveChanges = () => {
    const { items, editingItem } = this.state;
    if (!editingItem) return;

    const updatedItems = items.map(item => 
      item.id === editingItem.id ? editingItem : item
    );

    this.setState({
      items: updatedItems,
      isModalOpen: false,
      editingItem: null
    });
  };

  // <-- New Action for Pagination
  private handlePageChange = (page: number) => {
    this.setState({ activePage: page });
  };

  // ─── RENDER ───────────────────────────────────────────────────────────

  public render(): React.ReactElement<IMintextDatagridWepartProps> {
    const { items, isModalOpen, editingItem, activePage } = this.state;
    
    const { workflowName, status, showWorkflowDetails } = this.props;

    // ─── PAGINATION LOGIC ───
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Slice the items array to only show the current page's rows
    const currentItems = items.slice(startIndex, endIndex);

    // Map over currentItems instead of items
    const rows = currentItems.map((element) => (
      <tr key={element.id}>
        <td><Text size="sm" weight={500}>{element.title}</Text></td>
        <td>{element.category}</td>
        <td style={{ textAlign: 'center' }}>
          <Text size="sm" color="dimmed">
            {new Date(element.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
        </td>
        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          ₹{element.amount.toLocaleString('en-IN')}
        </td>
        <td>
          <Badge 
            color={element.status === 'Active' ? 'teal' : element.status === 'Pending' ? 'orange' : 'gray'}
            variant="light"
          >
            {element.status}
          </Badge>
        </td>
        <td>
          <Group spacing={4} position="center" noWrap>
            <ActionIcon color="blue" variant="subtle" onClick={() => this.handleEditClick(element)} title="Edit Item">
              <IconEdit size={18} />
            </ActionIcon>
            {/* <ActionIcon color="red" variant="subtle" title="Delete Item">
              <IconTrash size={18} />
            </ActionIcon> */}
          </Group>
        </td>
      </tr>
    ));

    return (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <section style={{ padding: '20px' }}>
          {/* {showWorkflowDetails && ( */}
            <Paper 
              withBorder 
              shadow="sm" 
              radius="md" 
              p="md" 
              mb="md" 
              sx={{ backgroundColor: '#e7f5ff', borderColor: '#74c0fc' }}
            >
              <Group position="apart">
                <Text weight={600} size="lg">
                  Active Workflow: <Text span color="blue">{workflowName || "Not configured"}</Text>
                </Text>
                <Text weight={600} size="lg">
                  Is Editable: <Text span color="blue">{showWorkflowDetails.toString()}</Text>
                </Text>
                <Badge size="lg" color="blue" variant="filled">
                  {status || "No Status"}
                </Badge>
              </Group>
            </Paper>
          {/* )} */}
          <Paper withBorder shadow="sm" radius="md" p={0} sx={{ overflow: 'hidden' }}>
            <Box p="md">
              <Title order={3} mb="md">Nintex Datagrid</Title>
              
              <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                <thead>
                  <tr>
                    <th>Project Title</th>
                    <th>Department</th>
                    <th style={{ textAlign: 'center' }}>Date</th>
                    <th style={{ textAlign: 'right' }}>Value (₹)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </Table>
            </Box>

            {/* ─── PAGINATION FOOTER ─── */}
            <Divider />
            <Group position="apart" p="sm" sx={{ backgroundColor: '#f8f9fa' }}>
              <Text size="sm" color="dimmed">
                Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, items.length)}</b> of <b>{items.length}</b> entries
              </Text>
              <Pagination 
                page={activePage} 
                onChange={this.handlePageChange} 
                total={totalPages} 
                size="sm"
                radius="md"
              />
            </Group>
          </Paper>

          {/* ─── EDIT MODAL ────────────────────────────────────────────────── */}
          <Modal
            opened={isModalOpen}
            onClose={this.handleCloseModal}
            title={<Text weight={700}>Edit Record</Text>}
            centered
          >
            {editingItem && (
              <Stack spacing="sm">
                <TextInput
                  label="Project Title"
                  value={editingItem.title}
                  onChange={(e:any) => this.handleFieldChange('title', e.currentTarget.value)}
                  data-autofocus
                />
                <TextInput
                  label="Department"
                  value={editingItem.category}
                  onChange={(e:any) => this.handleFieldChange('category', e.currentTarget.value)}
                />
                <Group grow>
                  <TextInput
                    type="date"
                    label="Date"
                    value={editingItem.date}
                    onChange={(e:any) => this.handleFieldChange('date', e.currentTarget.value)}
                  />
                  <NumberInput
                    label="Value (₹)"
                    value={editingItem.amount}
                    onChange={(val:any) => this.handleFieldChange('amount', val || 0)}
                    hideControls
                  />
                </Group>
                <Select
                  label="Status"
                  data={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Closed', label: 'Closed' }
                  ]}
                  value={editingItem.status}
                  onChange={(val:any) => this.handleFieldChange('status', val)}
                />
                <Group position="right" mt="md">
                  <Button variant="default" onClick={this.handleCloseModal}>Cancel</Button>
                  <Button onClick={this.handleSaveChanges}>Save Changes</Button>
                </Group>
              </Stack>
            )}
          </Modal>

        </section>
      </MantineProvider>
    );
  }
}