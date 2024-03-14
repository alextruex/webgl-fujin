import bpy


def write_some_data(context, filepath, use_some_setting):
    scale = 16
    output = ""
    output += "let mdl = [\n"

    me = bpy.context.object.data
    uv_layer = me.uv_layers.active.data
    for obj in bpy.context.scene.objects:
        if hasattr(obj.data,'polygons'):
            for poly in obj.data.polygons:
                for loop_index in range(poly.loop_start, poly.loop_start + poly.loop_total):
                    vert = me.loops[loop_index].vertex_index
                    output += str(obj.data.vertices[vert].co.x*scale) + ','
                    output += str(obj.data.vertices[vert].co.y*scale) + ','
                    output += str(obj.data.vertices[vert].co.z*scale) + ','
                    output += str(uv_layer[loop_index].uv.x) + ','
                    output += str(uv_layer[loop_index].uv.y) + ','
                    output += '\n'
    
    #for obj in bpy.context.scene.objects:
    #    if hasattr(obj.data,'polygons'):
    #        for f in obj.data.polygons:
    #            for v in f.vertices:
    #                output += str((obj.data.vertices[v].co.x*scale)) + ','
    #               output += str((obj.data.vertices[v].co.y*scale)) + ','
    #                output += str((obj.data.vertices[v].co.z*scale)) + ','
    #                output += '\n'

    output += "];\n\nexport default mdl;"
    
    print("running write_some_data...")
    f = open(filepath, 'w', encoding='utf-8')
    f.write(output)
    f.close()

    return {'FINISHED'}


# ExportHelper is a helper class, defines filename and
# invoke() function which calls the file selector.
from bpy_extras.io_utils import ExportHelper
from bpy.props import StringProperty, BoolProperty, EnumProperty
from bpy.types import Operator


class ExportSomeData(Operator, ExportHelper):
    """This appears in the tooltip of the operator and in the generated docs"""
    bl_idname = "export_test.some_data"  # important since its how bpy.ops.import_test.some_data is constructed
    bl_label = "Export Some Data"

    # ExportHelper mixin class uses this
    filename_ext = ".txt"

    filter_glob: StringProperty(
        default="*.txt",
        options={'HIDDEN'},
        maxlen=255,  # Max internal buffer length, longer would be clamped.
    )

    # List of operator properties, the attributes will be assigned
    # to the class instance from the operator settings before calling.
    use_setting: BoolProperty(
        name="Example Boolean",
        description="Example Tooltip",
        default=True,
    )

    type: EnumProperty(
        name="Example Enum",
        description="Choose between two items",
        items=(
            ('OPT_A', "First Option", "Description one"),
            ('OPT_B', "Second Option", "Description two"),
        ),
        default='OPT_A',
    )

    def execute(self, context):
        return write_some_data(context, self.filepath, self.use_setting)


# Only needed if you want to add into a dynamic menu
def menu_func_export(self, context):
    self.layout.operator(ExportSomeData.bl_idname, text="Text Export Operator")


# Register and add to the "file selector" menu (required to use F3 search "Text Export Operator" for quick access).
def register():
    bpy.utils.register_class(ExportSomeData)
    bpy.types.TOPBAR_MT_file_export.append(menu_func_export)


def unregister():
    bpy.utils.unregister_class(ExportSomeData)
    bpy.types.TOPBAR_MT_file_export.remove(menu_func_export)


if __name__ == "__main__":
    register()

    # test call
    bpy.ops.export_test.some_data('INVOKE_DEFAULT')
