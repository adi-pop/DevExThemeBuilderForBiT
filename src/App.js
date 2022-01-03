import React from "react";
// general controls
import CheckBox from "devextreme-react/check-box";
import SelectBox from "devextreme-react/select-box";
import RadioGroup from "devextreme-react/radio-group";
import ButtonGroup from "devextreme-react/button-group";
import ColorBox from "devextreme-react/color-box";
import NumberBox from "devextreme-react/number-box";
import Form from "devextreme-react/form";
import Tooltip from "devextreme-react/tooltip";

// Grid
import DataGrid, {
  Column,
  Editing,
  Selection,
  RowDragging,
  ColumnChooser,
  ColumnFixing,
  Grouping,
  GroupPanel,
  Scrolling,
  LoadPanel,
  Pager,
  Paging,
  RequiredRule,
  PatternRule,
  SearchPanel,
  Sorting,
  FilterRow,
  HeaderFilter,
  Summary,
  TotalItem
} from "devextreme-react/data-grid";

// Pivot
import PivotGrid, {
  FieldChooser,
  FieldPanel
  //HeaderFilter, - already imported for DataGrid
  //Scrolling,    -//-
} from "devextreme-react/pivot-grid";

import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

// data for grid
import service from "./grid-data.js";
// data for pivot
import sales from "./pivot-data.js";

// import { formatDate } from 'devextreme/localization';

// theming consts
const themes = [
  { key: "Blue", color: "#3366CC" },
  { key: "Green", color: "#4CB35D" },
  { key: "Yellow", color: "#D9BB26" },
  { key: "Red", color: "#D92644" },
  { key: "Purple", color: "#BF40BF" }
];
const roundnesses = ["none", "fine", "some", "full"];
const roundnessValues = [
  [0, 0],
  [4, 8],
  [8, 16],
  [100, 24]
];
// forms consts
const labelLocations = ["left", "top"];
const columnsCount = ["auto", 1, 2, 3];
const minColumnWidths = [150, 200, 300];

//grid consts
const allowedPageSizes = [10, 20, 50, 100];
const saleAmountEditorOptions = { format: "currency", showClearButton: true };
const resizingModes = ["widget", "nextColumn"];
const selectingModes = ["single", "multiple"];
const editModes = ["cell", "row", "batch", "form", "popup"];
const startEditActions = ["click", "dblClick"];
const startupSelectedKeys = [1];
const filterTypes = [
  {
    key: "auto",
    name: "Immediately"
  },
  {
    key: "onClick",
    name: "On Button Click"
  }
];

// pivot consts

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
    this.applyFilterTypes = filterTypes["auto"];
    this.saleAmountHeaderFilter = [
      {
        text: "Less than $3000",
        value: ["SaleAmount", "<", 3000]
      },
      {
        text: "$3000 - $5000",
        value: [
          ["SaleAmount", ">=", 3000],
          ["SaleAmount", "<", 5000]
        ]
      },
      {
        text: "$5000 - $10000",
        value: [
          ["SaleAmount", ">=", 5000],
          ["SaleAmount", "<", 10000]
        ]
      },
      {
        text: "$10000 - $20000",
        value: [
          ["SaleAmount", ">=", 10000],
          ["SaleAmount", "<", 20000]
        ]
      },
      {
        text: "Greater than $20000",
        value: ["SaleAmount", ">=", 20000]
      }
    ];

    //this.scrollingModes = ["infinite", "standard", "virtual"]

    this.state = {
      view: "grid",
      //theming state attr
      themeId: 0,
      accentColor: themes[0].color,
      roundness: roundnesses[0],
      showBorders: true,
      showRowLines: true,
      rowAlternationEnabled: true,
      showColumnLines: true,

      //form state attr
      labelLocation: "top",
      readOnly: false,
      showColon: true,
      minColWidth: 300,
      colCount: 2,

      //grid state attr
      showGroupPanel: true,
      showSearchPanel: true,
      autoExpandAll: true,
      showDragIcons: true,
      scrollingMode: "standard",
      showFilterRow: true,
      showHeaderFilter: true,
      colResizeMode: resizingModes[0],
      columnChooser: true,
      columnFixing: true,
      allowColumnResizing: true,
      allowColumnReordering: true,
      selectingMode: selectingModes[1],
      currentFilter: filterTypes[0].key,
      selectTextOnEditStart: true,
      startEditAction: "click",
      editingMode: editModes[1],

      //pivot state attributes
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowSearch: true,
      showRelevantValues: true,
      showTotalsPrior: false,
      dataFieldArea: false,
      rowHeaderLayout: true,

      //other
      tooltipVisible: false
    };

    this.onViewChanged = this.onViewChanged.bind(this);
    //grid bindings
    this.applyTheme = this.applyTheme.bind(this);
    this.dataGrid = null;
    this.onValueChanged = this.onValueChanged.bind(this);
    this.orderHeaderFilter = this.orderHeaderFilter.bind(this);
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
    this.changeResizingMode = this.changeResizingMode.bind(this);
    this.changeSelectingMode = this.changeSelectingMode.bind(this);
    this.changeEditingMode = this.changeEditingMode.bind(this);
    this.onReorder = this.onReorder.bind(this);
    this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);
    //pivot bindings
    this.onShowColumnFieldsChanged = this.onShowColumnFieldsChanged.bind(this);
    this.onShowDataFieldsChanged = this.onShowDataFieldsChanged.bind(this);
    this.onShowFilterFieldsChanged = this.onShowFilterFieldsChanged.bind(this);
    this.onShowRowFieldsChanged = this.onShowRowFieldsChanged.bind(this);
    this.onContextMenuPreparing = this.onContextMenuPreparing.bind(this);
    this.onAllowSearchChanged = this.onAllowSearchChanged.bind(this);
    this.onShowRelevantValuesChanged = this.onShowRelevantValuesChanged.bind(
      this
    );
    //theme bindings
    this.onThemeChanged = this.onThemeChanged.bind(this);
    this.onRoundnessChanged = this.onRoundnessChanged.bind(this);
    this.onAccentColorChanged = this.onAccentColorChanged.bind(this);
    this.onShowTotalsPriorChanged = this.onShowTotalsPriorChanged.bind(this);
    this.onDataFieldAreaChanged = this.onDataFieldAreaChanged.bind(this);
    this.onRowHeaderLayoutChanged = this.onRowHeaderLayoutChanged.bind(this);
    // other bindings
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  // generate the page
  render() {
    return (
      <React.Fragment>
        <div id="demo-page">
          <div className="buttons-top">
            <ButtonGroup
              items={[{ text: "grid" }, { text: "pivot" }]}
              onItemClick={this.onViewChanged}
              selectedItemKeys={[this.state.view]}
            />
          </div>
          {this.state.view === "grid" && (
            <div id="demo-grid">
              <DataGrid
                id="gridContainer"
                ref={(ref) => (this.dataGrid = ref)}
                dataSource={this.orders}
                height={640}
                keyExpr="ID"
                defaultSelectedRowKeys={startupSelectedKeys}
                onSelectionChanged={this.onSelectionChanged}
                allowColumnResizing={this.state.allowColumnResizing}
                columnResizingMode={this.state.colResizeMode}
                columnMinWidth={40}
                columnAutoWidth={true}
                columnHidingEnabled={false}
                allowColumnReordering={this.state.allowColumnReordering}
                showBorders={this.state.showBorders}
                showColumnLines={this.state.showColumnLines}
                showRowLines={this.state.showRowLines}
                rowAlternationEnabled={this.state.rowAlternationEnabled}
              >
                <Editing
                  allowAdding={true}
                  allowUpdating={true}
                  allowDeleting={true}
                  mode={this.state.editingMode}
                  useIcons={true}
                  selectTextOnEditStart={this.state.selectTextOnEditStart}
                  startEditAction={this.state.startEditAction}
                />
                <RowDragging
                  allowReordering={false}
                  onReorder={this.onReorder}
                  showDragIcons={this.state.showDragIcons}
                />
                <Grouping autoExpandAll={this.state.autoExpandAll} />
                <GroupPanel visible={this.state.showGroupPanel} />
                <Scrolling mode={this.state.scrollingMode} />
                <LoadPanel enabled={true} />
                <Pager
                  allowedPageSizes={allowedPageSizes}
                  showInfo={true}
                  showNavigationButtons={true}
                  showPageSizeSelector={true}
                  visible={true}
                />
                <Paging defaultPageSize={20} />
                <Sorting mode="multiple" />
                <Selection mode={this.state.selectingMode} />
                <FilterRow
                  visible={this.state.showFilterRow}
                  applyFilter={this.state.currentFilter}
                />
                <HeaderFilter visible={this.state.showHeaderFilter} />
                <SearchPanel
                  visible={this.state.showSearchPanel}
                  width={240}
                  placeholder="Search..."
                />
                <ColumnChooser enabled={this.state.columnChooser} />
                <ColumnFixing enabled={this.state.columnFixing} />
                <Column
                  dataField="OrderNumber"
                  width={140}
                  caption="Invoice Number"
                >
                  <HeaderFilter groupInterval={10000} />
                </Column>
                <Column
                  dataField="OrderDate"
                  alignment="right"
                  dataType="date"
                  width={120}
                  calculateFilterExpression={this.calculateFilterExpression}
                >
                  <HeaderFilter dataSource={this.orderHeaderFilter} />
                </Column>
                <Column
                  dataField="DeliveryDate"
                  alignment="right"
                  dataType="datetime"
                  format="M/d/yyyy, HH:mm"
                  width={180}
                />
                <Column dataField="Employee" />
                <Column dataField="CustomerStoreCity" caption="City">
                  <HeaderFilter allowSearch={true} />
                </Column>
                <Column dataField="Phone">
                  <RequiredRule />
                  <PatternRule
                    message={'Your phone must have "(+40) 722-283.444" format!'}
                    pattern={/^\(\+\d{2}\) \d{3}-\d{3}.\d{3}$/i}
                  />
                </Column>
                <Column
                  dataField="SaleAmount"
                  alignment="right"
                  dataType="number"
                  format="currency"
                  editorOptions={saleAmountEditorOptions}
                >
                  <HeaderFilter dataSource={this.saleAmountHeaderFilter} />
                </Column>
                <Summary calculateCustomSummary={this.calculateSelectedRow}>
                  <TotalItem
                    name="SelectedRowsSummary"
                    summaryType="custom"
                    valueFormat="currency"
                    displayFormat="Sum: {0}"
                    showInColumn="SaleAmount"
                  />
                </Summary>
              </DataGrid>
            </div>
          )}

          {this.state.view === "pivot" && (
            <div id="demo-pivot">
              <PivotGrid
                id="sales"
                dataSource={dataSource}
                allowSortingBySummary={true}
                allowSorting={true}
                allowFiltering={true}
                showBorders={this.state.showBorders}
                onContextMenuPreparing={this.onContextMenuPreparing}
                showTotalsPrior={this.state.showTotalsPrior ? "both" : "none"}
                dataFieldArea={this.state.dataFieldArea ? "row" : "column"}
                rowHeaderLayout={
                  this.state.rowHeaderLayout ? "tree" : "standard"
                }
                wordWrapEnabled={false}
              >
                <HeaderFilter
                  allowSearch={this.state.allowSearch}
                  showRelevantValues={this.state.showRelevantValues}
                  width={300}
                  height={400}
                />
                <FieldPanel
                  showColumnFields={this.state.showColumnFields}
                  showDataFields={this.state.showDataFields}
                  showFilterFields={this.state.showFilterFields}
                  showRowFields={this.state.showRowFields}
                  allowFieldDragging={true}
                  visible={true}
                />
                <FieldChooser height={500} />
              </PivotGrid>
            </div>
          )}

          <div className="options-gray">
            <span className="panel-name">Theme options</span>
            <div className="caption">Theme color</div>
            <div className="option">
              <RadioGroup
                items={Object.keys(themes).map(function (k) {
                  return themes[k].key;
                })}
                defaultValue={themes[this.state.themeId].key}
                layout="horizontal"
                onValueChanged={this.onThemeChanged}
              />
            </div>
            <br />
            <div className="option color-selector">
              <span className="dx-field-item-label-text">Accent color:</span>
              <ColorBox
                id="this.props.accentColor"
                key={this.state.accentColor}
                defaultValue={this.state.accentColor}
                onValueChange={this.onAccentColorChanged}
              />
            </div>
            <div className="option color-hsl down">
              {showHsl(rgbToHsl(this.state.accentColor))}
            </div>
            <div className="option color-hsl down">
              <div
                id="color-main"
                className="color-box color-main"
                onMouseEnter={this.toggleTooltip}
                onMouseLeave={this.toggleTooltip}
              >
                <Tooltip
                  target="#color-main"
                  position="top"
                  visible={this.state.tooltipVisible}
                  closeOnOutsideClick={true}
                >
                  <div>--main-color</div>
                </Tooltip>
              </div>
              <div className="color-box color-accent"></div>
              <div className="color-box color-accent3"></div>
              <div className="color-box color-accent2"></div>
              <div className="color-box color-accent1"></div>
              <div className="color-box color-white"></div>
            </div>
            <div className="caption">Roundness</div>
            <div className="option">
              <RadioGroup
                items={roundnesses}
                defaultValue={this.state.roundness}
                layout="horizontal"
                onValueChanged={this.onRoundnessChanged}
              />
            </div>
            <div className="caption">Grid apearence</div>
            <div className="option">
              <CheckBox
                text="Show Borders"
                value={this.state.showBorders}
                onValueChanged={this.onValueChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                text="Show Row Lines"
                value={this.state.showRowLines}
                onValueChanged={this.onValueChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                text="Show Column Lines"
                value={this.state.showColumnLines}
                onValueChanged={this.onValueChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                text="Alternate Row Color"
                value={this.state.rowAlternationEnabled}
                onValueChanged={this.onValueChanged}
              />
            </div>
          </div>

          {this.state.view === "grid" && (
            <div>
              <div className="options">
                <span className="panel-name">Grid options</span>
                <div className="caption">Panels</div>
                <div className="option">
                  <CheckBox
                    text="Show Group Panel"
                    value={this.state.showGroupPanel}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="option">
                  <CheckBox
                    text="Show Search Panel"
                    value={this.state.showSearchPanel}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="option">
                  <CheckBox
                    text="Column Chooser"
                    value={this.state.columnChooser}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="caption">Filtering</div>
                <div className="option">
                  <span className="dx-field-item-label-text">
                    Filtering mode:
                  </span>
                  <SelectBox
                    items={filterTypes}
                    valueExpr="key"
                    displayExpr="name"
                    value={this.state.currentFilter}
                    onValueChanged={this.onCurrentFilterChanged}
                    disabled={!this.state.showFilterRow}
                  />
                </div>
                <div className="option down">
                  <CheckBox
                    text="Header Filter"
                    value={this.state.showHeaderFilter}
                    onValueChanged={this.onShowHeaderFilterChanged}
                  />
                </div>
                <div className="option down">
                  <CheckBox
                    text="Filter Row"
                    value={this.state.showFilterRow}
                    onValueChanged={this.onShowFilterRowChanged}
                  />
                </div>
                <div className="caption">Resize Columns</div>
                <div className="option">
                  <span className="dx-field-item-label-text">
                    Resizing mode:
                  </span>
                  <SelectBox
                    items={resizingModes}
                    value={this.state.colResizeMode}
                    onValueChanged={this.changeResizingMode}
                  />
                </div>
                <div className="option down">
                  <CheckBox
                    text="Column Fixing"
                    value={this.state.columnFixing}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="option down">
                  <CheckBox
                    text="Allow Column Reordering"
                    value={this.state.allowColumnReordering}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="option down">
                  <CheckBox
                    text="Allow Column Resizing"
                    value={this.state.allowColumnResizing}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="caption">Grouping</div>
                <div className="option">
                  <CheckBox
                    text="Expand All Groups"
                    value={this.state.autoExpandAll}
                    onValueChanged={this.onValueChanged}
                  />
                </div>
                <div className="caption up">Select Rows</div>
                <div className="option selector">
                  <span className="dx-field-item-label-text">
                    Selecting mode:
                  </span>
                  <SelectBox
                    items={selectingModes}
                    value={this.state.selectingMode}
                    onValueChanged={this.changeSelectingMode}
                  />
                </div>
                <div className="caption">Editing</div>
                <div className="option">
                  <span className="dx-field-item-label-text">Edit Mode:</span>
                  <SelectBox
                    items={editModes}
                    value={this.state.editingMode}
                    onValueChanged={this.changeEditingMode}
                  />
                </div>
                <div className="option">
                  <span className="dx-field-item-label-text">
                    Start Edit Action:
                  </span>
                  <SelectBox
                    items={startEditActions}
                    value={this.state.startEditAction}
                    onValueChanged={this.onStartEditActionChanged}
                  />
                </div>
                <div className="option down">
                  <CheckBox
                    value={this.state.selectTextOnEditStart}
                    text="Select Text on Edit Start"
                    onValueChanged={this.onSelectTextOnEditStartChanged}
                  />
                </div>
              </div>
            </div>
          )}
          {this.state.view === "pivot" && (
            <div>
              <div className="options">
                <span className="panel-name">Pivot options</span>
                <div className="caption">Layout options</div>
                <div className="option">
                  <CheckBox
                    id="show-totals-prior"
                    text="Show Totals Prior"
                    value={this.state.showTotalsPrior}
                    onValueChanged={this.onShowTotalsPriorChanged}
                  />
                </div>
                <div className="option">
                  <CheckBox
                    id="data-field-area"
                    text="Data Field Headers in Rows"
                    value={this.state.dataFieldArea}
                    onValueChanged={this.onDataFieldAreaChanged}
                  />
                </div>
                <div className="option">
                  <CheckBox
                    id="row-header-layout"
                    text="Tree Row Header Layout"
                    value={this.state.rowHeaderLayout}
                    onValueChanged={this.onRowHeaderLayoutChanged}
                  />
                </div>
                <div className="caption">Field panel</div>
                <div className="option">
                  <CheckBox
                    id="show-data-fields"
                    value={this.state.showColumnFields}
                    onValueChanged={this.onShowColumnFieldsChanged}
                    text="Show Data Fields"
                  />
                </div>
                <div className="option">
                  <CheckBox
                    id="show-row-fields"
                    value={this.state.showDataFields}
                    onValueChanged={this.onShowDataFieldsChanged}
                    text="Show Row Fields"
                  />
                </div>
                <div className="option">
                  <CheckBox
                    id="show-column-fields"
                    value={this.state.showFilterFields}
                    onValueChanged={this.onShowFilterFieldsChanged}
                    text="Show Column Fields"
                  />
                </div>
                <div className="option">
                  <CheckBox
                    id="show-filter-fields"
                    value={this.state.showRowFields}
                    onValueChanged={this.onShowRowFieldsChanged}
                    text="Show Filter Fields"
                  />
                </div>
                <div className="caption">Header Filter options</div>
                <div className="option">
                  <CheckBox
                    value={this.state.allowSearch}
                    text="Allow Search"
                    onValueChanged={this.onAllowSearchChanged}
                  />
                </div>
                <div className="option">
                  <CheckBox
                    value={this.state.showRelevantValues}
                    text="Show Relevant Values"
                    onValueChanged={this.onShowRelevantValuesChanged}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }

  onViewChanged() {
    this.setState({ view: this.state.view === "grid" ? "pivot" : "grid" });
  }

  onSelectTextOnEditStartChanged(args) {
    this.setState({
      selectTextOnEditStart: args.value
    });
  }

  onStartEditActionChanged(args) {
    this.setState({
      startEditAction: args.value
    });
  }

  calculateSelectedRow(options) {
    if (options.name === "SelectedRowsSummary") {
      if (options.summaryProcess === "start") {
        options.totalValue = 0;
      } else if (options.summaryProcess === "calculate") {
        if (options.component.isRowSelected(options.value.ID)) {
          options.totalValue = options.totalValue + options.value.SaleAmount;
        }
      }
    }
  }

  onSelectionChanged(e) {
    e.component.refresh(true);
  }

  onValueChanged(e) {
    let optionName = null;
    switch (e.component.option("text")) {
      case "Show Column Lines": {
        optionName = "showColumnLines";
        break;
      }
      case "Show Group Panel": {
        optionName = "showGroupPanel";
        break;
      }
      case "Show Search Panel": {
        optionName = "showSearchPanel";
        break;
      }
      case "Show Row Lines": {
        optionName = "showRowLines";
        break;
      }
      case "Show Borders": {
        optionName = "showBorders";
        break;
      }
      case "Alternate Row Color": {
        optionName = "rowAlternationEnabled";
        break;
      }
      case "Column Chooser": {
        optionName = "columnChooser";
        break;
      }
      case "Column Fixing": {
        optionName = "columnFixing";
        break;
      }
      case "Allow Column Resizing": {
        optionName = "allowColumnResizing";
        break;
      }
      case "Allow Column Reordering": {
        optionName = "allowColumnReordering";
        break;
      }
      default: {
        optionName = "autoExpandAll";
        break;
      }
    }

    this.setState({ [optionName]: e.value });
  }

  changeResizingMode(e) {
    this.setState({ colResizeMode: e.value });
  }

  changeSelectingMode(e) {
    this.setState({ selectingMode: e.value });
  }

  changeEditingMode(e) {
    this.setState({ editingMode: e.value });
  }

  calculateFilterExpression(value, selectedFilterOperations, target) {
    let column = this;
    if (target === "headerFilter" && value === "weekends") {
      return [[getOrderDay, "=", 0], "or", [getOrderDay, "=", 6]];
    }
    return column.defaultCalculateFilterExpression.apply(this, arguments);
  }

  orderHeaderFilter(data) {
    data.dataSource.postProcess = (results) => {
      results.push({
        text: "Weekends",
        value: "weekends"
      });
      return results;
    };
  }

  onShowFilterRowChanged(e) {
    this.setState({
      showFilterRow: e.value
    });
    this.clearFilter();
  }

  onShowHeaderFilterChanged(e) {
    this.setState({ showHeaderFilter: e.value });
    this.clearFilter();
  }

  onCurrentFilterChanged(e) {
    this.setState({ currentFilter: e.value });
  }

  clearFilter() {
    this.dataGrid.instance.clearFilter();
  }

  onReorder(e) {
    const visibleRows = e.component.getVisibleRows();
    const newTasks = [...this.state.tasks];
    const toIndex = newTasks.indexOf(visibleRows[e.toIndex].data);
    const fromIndex = newTasks.indexOf(e.itemData);

    newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, e.itemData);

    this.setState({ tasks: newTasks });
  }

  onShowDragIconsChanged(e) {
    this.setState({ showDragIcons: e.value });
  }

  //pivot
  onShowColumnFieldsChanged(e) {
    this.setState({ showColumnFields: e.value });
  }

  onShowDataFieldsChanged(e) {
    this.setState({ showDataFields: e.value });
  }

  onShowFilterFieldsChanged(e) {
    this.setState({ showFilterFields: e.value });
  }

  onShowRowFieldsChanged(e) {
    this.setState({ showRowFields: e.value });
  }

  onContextMenuPreparing(e) {
    const sourceField = e.field;

    if (sourceField) {
      if (!sourceField.groupName || sourceField.groupIndex === 0) {
        e.items.push({
          text: "Hide field",
          onItemClick() {
            let fieldIndex;
            if (sourceField.groupName) {
              fieldIndex = dataSource.getAreaFields(sourceField.area, true)[
                sourceField.areaIndex
              ].index;
            } else {
              fieldIndex = sourceField.index;
            }

            dataSource.field(fieldIndex, {
              area: null
            });
            dataSource.load();
          }
        });
      }

      if (sourceField.dataType === "number") {
        const menuItems = [];

        e.items.push({ text: "Summary Type", items: menuItems });
        ["Sum", "Avg", "Min", "Max"].forEach((summaryType) => {
          const summaryTypeValue = summaryType.toLowerCase();

          menuItems.push({
            text: summaryType,
            value: summaryType.toLowerCase(),
            onItemClick(args) {
              setSummaryType(args, sourceField);
            },
            selected: e.field.summaryType === summaryTypeValue
          });
        });
      }
    }
  }

  onAllowSearchChanged(data) {
    this.setState({
      allowSearch: data.value
    });
  }

  onShowRelevantValuesChanged(data) {
    this.setState({
      showRelevantValues: data.value
    });
  }
  onShowTotalsPriorChanged(data) {
    this.setState({
      showTotalsPrior: data.value
    });
  }

  onDataFieldAreaChanged(data) {
    this.setState({
      dataFieldArea: data.value
    });
  }

  onRowHeaderLayoutChanged(data) {
    this.setState({
      rowHeaderLayout: data.value
    });
  }

  // theming
  onRoundnessChanged(e) {
    var i = roundnesses.indexOf(e.value);
    this.setState({ roundness: e.value });
    document.documentElement.style.setProperty(
      "--radius-sm",
      roundnessValues[i][0] + "px"
    );
    document.documentElement.style.setProperty(
      "--radius-lg",
      roundnessValues[i][1] + "px"
    );
  }

  onThemeChanged(e) {
    var id = Object.keys(themes)
      .map(function (k) {
        return themes[k].key;
      })
      .indexOf(e.value);
    this.setState({
      themeId: id,
      accentColor: themes[id].color
    });
    this.applyTheme();
  }

  onAccentColorChanged(e) {
    this.setState({ accentColor: e });
    this.applyTheme();
  }

  applyTheme() {
    var a = rgbToHsl(this.state.accentColor);
    document.documentElement.style.setProperty("--accent-color-h", a[0]);
    document.documentElement.style.setProperty("--accent-color-s", a[1] + "%");
    document.documentElement.style.setProperty("--accent-color-l", a[2] + "%");
  }

  toggleTooltip() {
    this.setState({
      tooltipVisible: !this.state.tooltipVisible
    });
  }
}

// pivot
const dataSource = new PivotGridDataSource({
  fields: [
    {
      caption: "Region",
      width: 120,
      dataField: "region",
      area: "row"
    },
    {
      caption: "City",
      dataField: "city",
      width: 150,
      area: "row",
      selector(data) {
        return `${data.city} (${data.country})`;
      }
    },
    {
      dataField: "date",
      dataType: "date",
      area: "column"
    },
    {
      dataField: "sales",
      dataType: "number",
      summaryType: "sum",
      format: "currency",
      area: "data"
    },
    {
      caption: "Running Total",
      dataField: "sales",
      dataType: "number",
      summaryType: "sum",
      format: "currency",
      area: "data",
      runningTotal: "row",
      allowCrossGroupCalculation: true
    }
  ],
  store: sales
});

function setSummaryType(args, sourceField) {
  dataSource.field(sourceField.index, {
    summaryType: args.itemData.value
  });

  dataSource.load();
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(rgb) {
  var c,
    r = 0,
    g = 0,
    b = 0;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(rgb)) {
    c = rgb.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    r = (c >> 16) & 255;
    g = (c >> 8) & 255;
    b = c & 255;
  }

  r /= 255;
  g /= 255;
  b /= 255;

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return [Math.round(360 * h), Math.round(100 * s), Math.round(100 * l)];
}

function showHsl(hslArray) {
  return "hsl(" + hslArray[0] + ", " + hslArray[1] + "%, " + hslArray[2] + "%)";
}

function getOrderDay(rowData) {
  return new Date(rowData.OrderDate).getDay();
}

export default App;
